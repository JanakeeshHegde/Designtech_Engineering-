import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createStructuralModel, type StructuralModelInstance, type StructuralLayerId } from "./StructuralModel";
import "./BIM3DViewer.css";

interface Props {
  activeLayer: StructuralLayerId;
  className?: string;
}

export default function BIM3DViewer({ activeLayer, className = "" }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isBlueprint, setIsBlueprint] = useState<boolean>(false);
  const [showLoadPath, setShowLoadPath] = useState<boolean>(false);

  const modelRef = useRef<StructuralModelInstance | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const resumeTimerRef = useRef<number | null>(null);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  // Frame Camera dynamically to the exact visible bounding box of the selected structural stage
  const frameCameraToActiveModel = useCallback((w: number, h: number, layer: StructuralLayerId = activeLayer) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const model = modelRef.current;
    if (!camera || !controls || !model || w === 0 || h === 0) return;

    const aspect = w / h;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    // Get exact bounding box of the active visible geometry
    const bounds = model.getVisibleBounds();
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    bounds.getCenter(center);
    bounds.getSize(size);

    // Stage-specific camera centering & height focus
    if (layer === "roof") {
      // Focus prominently on the roof steel truss & upper superstructure
      center.set(-0.2, 5.8, 0);
      size.set(16, 11, 10);
    } else if (layer === "complete") {
      // Symmetrical framing of the entire building from apex (+10.3m) down to bedrock (-14.0m)
      center.set(-0.2, -1.2, 0);
      size.set(20, 25, 16);
    } else if (layer === "foundation") {
      center.set(-0.5, -5.8, 0);
      size.set(18, 16, 14);
    } else if (layer === "columns") {
      center.set(-0.2, -2.5, 0);
      size.set(18, 22, 14);
    } else if (layer === "beams" || layer === "slabs") {
      center.set(-0.2, -2.0, 0);
      size.set(18, 23, 14);
    }

    // Calculate required distance based on FOV and aspect ratio
    const fov = camera.fov * (Math.PI / 180);
    const maxDim = Math.max(size.x, size.y, size.z);
    let distance = (maxDim / 2) / Math.tan(fov / 2);

    if (layer === "roof") {
      distance *= 1.28;
    } else if (layer === "complete") {
      distance *= 1.38; // Clean generous safety margin so entire structure fits comfortably
    } else {
      distance *= 1.32;
    }

    if (aspect < 1.0) {
      // Narrow screens (mobile portrait) need proportional distance expansion
      distance /= aspect;
    }

    // Isometric presentation viewing vector tailored per stage
    const dir = layer === "roof"
      ? new THREE.Vector3(0.68, 0.40, 0.72).normalize()
      : new THREE.Vector3(0.68, 0.44, 0.74).normalize();

    camera.position.copy(center).addScaledVector(dir, distance);
    controls.target.copy(center);
    controls.update();
  }, [activeLayer]);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!webglSupported) return;
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();

    // Camera with safe clipping planes to prevent any model cut-offs
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 300);
    cameraRef.current = camera;

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
    renderer.toneMappingExposure = 1.12;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // OrbitControls with Continuous Auto-Rotation & Smooth Damping (Zoom strictly disabled)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = false; // Strictly disabled manual zoom
    controls.maxPolarAngle = Math.PI / 2 + 0.08;
    controls.autoRotate = true; // Continuous auto rotation
    controls.autoRotateSpeed = 0.55; // Professional subtle cinematic speed
    controlsRef.current = controls;

    // Handle user mouse/touch interaction with smooth auto-rotation resume
    const handleStartInteraction = () => {
      controls.autoRotate = false;
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    };

    const handleEndInteraction = () => {
      resumeTimerRef.current = window.setTimeout(() => {
        controls.autoRotate = true;
      }, 1500);
    };

    controls.addEventListener("start", handleStartInteraction);
    controls.addEventListener("end", handleEndInteraction);

    // Architectural Key, Ambient and Fill Lighting
    const ambientLight = new THREE.AmbientLight(0xf8f6f0, 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.3);
    sunLight.position.set(30, 45, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 5;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -22;
    sunLight.shadow.camera.right = 22;
    sunLight.shadow.camera.top = 22;
    sunLight.shadow.camera.bottom = -22;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x90b0d0, 0.8);
    fillLight.position.set(-25, 20, -25);
    scene.add(fillLight);

    const goldAccent = new THREE.PointLight(0xa87524, 1.5, 50);
    goldAccent.position.set(-8, 6, 14);
    scene.add(goldAccent);

    // Structural Model Instance
    const model = createStructuralModel({
      isBlueprint,
      showLoadPath,
      activeLayer,
    });
    modelRef.current = model;
    scene.add(model.group);

    // Initial camera framing
    frameCameraToActiveModel(width, height);

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

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          renderer.setSize(w, h);
          frameCameraToActiveModel(w, h);
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
  }, [webglSupported, frameCameraToActiveModel]);

  // Sync Active Layer & Dynamically Refocus/Reframe Camera
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.setActiveLayer(activeLayer);
      const container = mountRef.current;
      if (container) {
        frameCameraToActiveModel(container.clientWidth, container.clientHeight);
      }
    }
  }, [activeLayer, frameCameraToActiveModel]);

  // Sync Blueprint Mode
  useEffect(() => {
    modelRef.current?.setBlueprintMode(isBlueprint);
  }, [isBlueprint]);

  // Sync Load Path
  useEffect(() => {
    modelRef.current?.setShowLoadPath(showLoadPath);
  }, [showLoadPath]);

  if (!webglSupported) {
    return (
      <div className={`bim-scene-container ${className}`}>
        <div className="bim-fallback">
          <img
            src="/Inspect/foundation.png"
            alt="Raft / pile foundations transferring loads to bearing strata."
            className="bim-fallback-img"
          />
          <div className="bim-fallback-caption">
            Raft &amp; Pile Foundation Cutaway Diagram
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bim-scene-container ${className}`} aria-label="Interactive 3D BIM Structural Visualization">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="bim-canvas-mount" />

      {/* Top Engineering Mode Bar */}
      <div className="bim-top-bar">
        <div className="bim-status-tag">
          <span className="bim-live-dot" />
          <span>3D BIM MODEL &bull; {activeLayer.toUpperCase()} STAGE</span>
        </div>

        <div className="bim-mode-buttons">
          <button
            type="button"
            className={`bim-btn-pill ${!isBlueprint ? "bim-btn-pill--active" : ""}`}
            onClick={() => setIsBlueprint(false)}
            title="Realistic Materials"
          >
            SOLID BIM
          </button>
          <button
            type="button"
            className={`bim-btn-pill ${isBlueprint ? "bim-btn-pill--active" : ""}`}
            onClick={() => setIsBlueprint(true)}
            title="Technical Blueprint Linework"
          >
            BLUEPRINT
          </button>
          <button
            type="button"
            className={`bim-btn-pill ${showLoadPath ? "bim-btn-pill--active" : ""}`}
            onClick={() => setShowLoadPath(!showLoadPath)}
            title="Toggle Structural Load Vectors"
          >
            LOAD PATH
          </button>
        </div>
      </div>

      {/* Technical Strata Depth Legend Overlay (Visible on Foundation / Complete stages) */}
      {(activeLayer === "foundation" || activeLayer === "complete") && (
        <div className="bim-strata-legend">
          <div className="bim-strata-item">
            <span className="bim-strata-swatch" style={{ background: "#332217" }} />
            <span className="bim-strata-text">Topsoil &bull; GL &plusmn;0.00m</span>
          </div>
          <div className="bim-strata-item">
            <span className="bim-strata-swatch" style={{ background: "#cb9f5e" }} />
            <span className="bim-strata-text">Granular Sand &bull; -2.20m</span>
          </div>
          <div className="bim-strata-item">
            <span className="bim-strata-swatch" style={{ background: "#8a4724" }} />
            <span className="bim-strata-text">Stiff Clay &bull; -7.50m</span>
          </div>
          <div className="bim-strata-item">
            <span className="bim-strata-swatch" style={{ background: "#5c5044" }} />
            <span className="bim-strata-text">Weathered Rock &bull; -10.50m</span>
          </div>
          <div className="bim-strata-item">
            <span className="bim-strata-swatch" style={{ background: "#1e2229", border: "1px solid #a87524" }} />
            <span className="bim-strata-text bim-strata-highlight">Bearing Bedrock &bull; -14.00m</span>
          </div>
        </div>
      )}

      {/* Subtle interaction tip overlay */}
      <div className="bim-hint">
        <span>Drag with mouse / touch for 360&deg; manual inspection</span>
      </div>
    </div>
  );
}
