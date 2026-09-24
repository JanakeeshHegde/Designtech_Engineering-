import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createFoundationModel, type FoundationModelInstance } from "./FoundationModel";
import "./FoundationScene.css";

interface Props {
  className?: string;
  initialPhase?: number;
}

export default function FoundationScene({ className = "", initialPhase = 9 }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [constructionPhase, setConstructionPhase] = useState<number>(initialPhase);
  const [isBlueprint, setIsBlueprint] = useState<boolean>(false);
  const [showLoadPath, setShowLoadPath] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  const modelRef = useRef<FoundationModelInstance | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const targetCenterRef = useRef<THREE.Vector3>(new THREE.Vector3(0, -3.0, 0));
  const defaultDistanceRef = useRef<number>(38);
  const resumeTimerRef = useRef<number | null>(null);

  // Check WebGL availability & reduced motion preference
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAutoRotate(false);
    }
  }, []);

  // Frame Camera to Model
  const frameCameraToModel = useCallback((w: number, h: number) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls || w === 0 || h === 0) return;

    const aspect = w / h;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    // Model bounding box dimensions (W: 18, H: 23, D: 14)
    const fov = camera.fov * (Math.PI / 180);
    const modelRadius = 14.5; // Radius enclosing the foundation assembly
    
    // Calculate required camera distance so model occupies ~75-82% of viewport
    let distance = (modelRadius / Math.sin(fov / 2)) * 0.82;
    if (aspect < 1.0) {
      // For portrait / mobile screens, adjust for narrower width
      distance = distance / aspect;
    }

    // Clamp distance
    distance = Math.max(28, Math.min(distance, 58));
    defaultDistanceRef.current = distance;

    const center = targetCenterRef.current;
    // Engineering isometric angle
    const dir = new THREE.Vector3(0.68, 0.45, 0.72).normalize();
    camera.position.copy(center).addScaledVector(dir, distance);
    controls.target.copy(center);
    controls.update();
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!webglSupported) return;
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 480;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 250);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 18;
    controls.maxDistance = 70;
    controls.maxPolarAngle = Math.PI / 2 + 0.12; // Allow view from slightly below surface but prevent flipping
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.55; // Smooth slow rotation (~25s per rotation)
    controlsRef.current = controls;

    // Auto-rotation pause & resume on user drag
    const handleStartInteraction = () => {
      setIsInteracting(true);
      controls.autoRotate = false;
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    };

    const handleEndInteraction = () => {
      setIsInteracting(false);
      resumeTimerRef.current = window.setTimeout(() => {
        if (autoRotate) {
          controls.autoRotate = true;
        }
      }, 2000);
    };

    controls.addEventListener("start", handleStartInteraction);
    controls.addEventListener("end", handleEndInteraction);

    // Architectural Key, Ambient & Contact Lighting
    const ambientLight = new THREE.AmbientLight(0xf5f3ee, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunLight.position.set(30, 45, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 100;
    sunLight.shadow.camera.left = -22;
    sunLight.shadow.camera.right = 22;
    sunLight.shadow.camera.top = 22;
    sunLight.shadow.camera.bottom = -22;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x99b3cc, 0.75);
    fillLight.position.set(-25, 20, -25);
    scene.add(fillLight);

    const goldAccent = new THREE.PointLight(0xa87524, 1.4, 45);
    goldAccent.position.set(-8, 6, 14);
    scene.add(goldAccent);

    // Foundation Model Instance
    const model = createFoundationModel({
      isBlueprint,
      constructionPhase,
      showLoadPath,
    });
    modelRef.current = model;
    scene.add(model.group);

    // Initial camera framing
    frameCameraToModel(width, height);

    // Render loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      controls.update();
      model.update(time, delta);
      renderer.render(scene, camera);
    };

    animate();

    // Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          renderer.setSize(w, h);
          frameCameraToModel(w, h);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
      resizeObserver.disconnect();
      controls.removeEventListener("start", handleStartInteraction);
      controls.removeEventListener("end", handleEndInteraction);
      controls.dispose();
      model.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [webglSupported, frameCameraToModel]);

  // Sync Construction Phase
  useEffect(() => {
    modelRef.current?.setConstructionPhase(constructionPhase);
  }, [constructionPhase]);

  // Sync Blueprint Mode
  useEffect(() => {
    modelRef.current?.setBlueprintMode(isBlueprint);
  }, [isBlueprint]);

  // Sync Load Path
  useEffect(() => {
    modelRef.current?.setShowLoadPath(showLoadPath);
  }, [showLoadPath]);

  // Sync Auto Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Construction Sequence Player (Smooth progression through 9 phases)
  useEffect(() => {
    if (!isPlayingSequence) return;
    const interval = setInterval(() => {
      setConstructionPhase((prev) => {
        if (prev >= 9) {
          setIsPlayingSequence(false);
          return 9;
        }
        return prev + 1;
      });
    }, 1100);

    return () => clearInterval(interval);
  }, [isPlayingSequence]);

  const handleResetView = useCallback(() => {
    const container = mountRef.current;
    if (!container) return;
    frameCameraToModel(container.clientWidth, container.clientHeight);
  }, [frameCameraToModel]);

  const handleZoom = useCallback((direction: "in" | "out") => {
    if (!cameraRef.current || !controlsRef.current) return;
    const factor = direction === "in" ? 0.85 : 1.15;
    const center = targetCenterRef.current;
    const offset = cameraRef.current.position.clone().sub(center);
    offset.multiplyScalar(factor);
    cameraRef.current.position.copy(center).add(offset);
    controlsRef.current.update();
  }, []);

  const startSequence = () => {
    setConstructionPhase(1);
    setIsPlayingSequence(true);
  };

  const phases = [
    { num: 1, name: "Soil Strata" },
    { num: 2, name: "Bearing Rock" },
    { num: 4, name: "Bored Piles" },
    { num: 6, name: "Raft Slab" },
    { num: 7, name: "RC Columns" },
    { num: 8, name: "Load Path" },
    { num: 9, name: "Complete" },
  ];

  if (!webglSupported) {
    return (
      <div className={`foundation-scene-container ${className}`}>
        <div className="foundation-fallback">
          <img
            src="/Inspect/foundation.png"
            alt="Raft / pile foundations transferring loads to bearing strata."
            className="foundation-fallback-img"
          />
          <div className="foundation-fallback-caption">
            Raft &amp; Pile Foundation Cutaway Diagram
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`foundation-scene-container ${className}`} aria-label="Interactive 3D Foundation Visualization">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="foundation-canvas-mount" />

      {/* Top BIM Bar */}
      <div className="foundation-top-bar">
        <div className="foundation-status-tag">
          <span className="foundation-live-dot" />
          <span>3D BIM CUTAWAY &bull; 360&deg; ROTATION</span>
        </div>

        <div className="foundation-mode-buttons">
          <button
            type="button"
            className={`foundation-btn-pill ${!isBlueprint ? "foundation-btn-pill--active" : ""}`}
            onClick={() => setIsBlueprint(false)}
            title="Realistic Materials"
          >
            SOLID BIM
          </button>
          <button
            type="button"
            className={`foundation-btn-pill ${isBlueprint ? "foundation-btn-pill--active" : ""}`}
            onClick={() => setIsBlueprint(true)}
            title="Technical Blueprint Linework"
          >
            BLUEPRINT
          </button>
          <button
            type="button"
            className={`foundation-btn-pill ${showLoadPath ? "foundation-btn-pill--active" : ""}`}
            onClick={() => setShowLoadPath(!showLoadPath)}
            title="Toggle Load Vectors"
          >
            LOAD PATH
          </button>
        </div>
      </div>

      {/* Quick Camera Interaction Tools */}
      <div className="foundation-side-tools">
        <button
          type="button"
          className="foundation-tool-btn"
          onClick={() => handleZoom("in")}
          title="Zoom In"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          className="foundation-tool-btn"
          onClick={() => handleZoom("out")}
          title="Zoom Out"
          aria-label="Zoom out"
        >
          &minus;
        </button>
        <button
          type="button"
          className="foundation-tool-btn"
          onClick={handleResetView}
          title="Reset Camera Framing"
          aria-label="Reset camera"
        >
          &#8634;
        </button>
        <button
          type="button"
          className={`foundation-tool-btn ${autoRotate ? "foundation-tool-btn--active" : ""}`}
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? "Pause Auto Rotation" : "Resume Auto Rotation"}
          aria-label="Toggle auto rotation"
        >
          &infin;
        </button>
      </div>

      {/* Technical Strata Depth Legend Overlay */}
      <div className="foundation-strata-legend">
        <div className="strata-item">
          <span className="strata-swatch" style={{ background: "#332217" }} />
          <span className="strata-text">Topsoil &bull; GL &plusmn;0.00m</span>
        </div>
        <div className="strata-item">
          <span className="strata-swatch" style={{ background: "#cb9f5e" }} />
          <span className="strata-text">Granular Sand &bull; -2.20m</span>
        </div>
        <div className="strata-item">
          <span className="strata-swatch" style={{ background: "#8a4724" }} />
          <span className="strata-text">Stiff Clay &bull; -7.50m</span>
        </div>
        <div className="strata-item">
          <span className="strata-swatch" style={{ background: "#5c5044" }} />
          <span className="strata-text">Weathered Rock &bull; -10.50m</span>
        </div>
        <div className="strata-item">
          <span className="strata-swatch" style={{ background: "#1e2229", border: "1px solid #a87524" }} />
          <span className="strata-text strata-highlight">Bearing Bedrock &bull; -14.00m</span>
        </div>
      </div>

      {/* Bottom Construction Sequence Controller */}
      <div className="foundation-bottom-control">
        <div className="construction-header">
          <div className="construction-title">CONSTRUCTION SEQUENCE</div>
          <button
            type="button"
            className="construction-play-btn"
            onClick={startSequence}
            disabled={isPlayingSequence}
          >
            {isPlayingSequence ? "PLAYING..." : "PLAY SEQUENCE &#9654;"}
          </button>
        </div>

        <div className="construction-steps-bar" role="tablist">
          {phases.map((item) => (
            <button
              key={item.num}
              type="button"
              role="tab"
              aria-selected={constructionPhase === item.num}
              className={`construction-step-btn ${
                constructionPhase >= item.num ? "construction-step-btn--active" : ""
              } ${constructionPhase === item.num ? "construction-step-btn--current" : ""}`}
              onClick={() => {
                setIsPlayingSequence(false);
                setConstructionPhase(item.num);
              }}
            >
              <span className="construction-step-num">{item.num}</span>
              <span className="construction-step-name">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subtle interaction tip overlay */}
      <div className={`foundation-hint ${isInteracting ? "foundation-hint--hidden" : ""}`}>
        <span>Drag to rotate 360&deg; &bull; Scroll to zoom</span>
      </div>
    </div>
  );
}
