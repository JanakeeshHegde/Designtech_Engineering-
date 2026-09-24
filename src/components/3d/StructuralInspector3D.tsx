import { useEffect, useRef } from "react";
import * as THREE from "three";

export type StructuralLayer = "foundation" | "columns" | "beams" | "slabs" | "roof" | "complete";

interface Props {
  activeLayer: StructuralLayer;
  className?: string;
}

export default function StructuralInspector3D({ activeLayer, className = "" }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isAliveRef = useRef<boolean>(true);
  const activeLayerRef = useRef<StructuralLayer>(activeLayer);

  useEffect(() => {
    activeLayerRef.current = activeLayer;
  }, [activeLayer]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    isAliveRef.current = true;

    // Scene & Camera
    const scene = new THREE.Scene();
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(16, 12, 18);
    camera.lookAt(0, 3.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    container.appendChild(renderer.domElement);

    // Lights
    const ambLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    dirLight.position.set(15, 25, 15);
    scene.add(dirLight);

    const goldPoint = new THREE.PointLight(0xa87524, 2.0, 30);
    goldPoint.position.set(-10, 8, -10);
    scene.add(goldPoint);

    // Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Grid helper
    const grid = new THREE.GridHelper(18, 12, 0xa87524, 0xd9d5cc);
    grid.position.y = -0.02;
    modelGroup.add(grid);

    // Materials
    const matNormal = new THREE.MeshStandardMaterial({ color: 0xe5e1d8, roughness: 0.8 });
    const matDim = new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.25 });
    const matActive = new THREE.MeshStandardMaterial({ color: 0xa87524, metalness: 0.5, roughness: 0.3, emissive: 0x553810 });
    const matSteel = new THREE.MeshStandardMaterial({ color: 0x5a6472, metalness: 0.7, roughness: 0.3 });

    // 1. Foundation
    const fMesh = new THREE.Mesh(new THREE.BoxGeometry(11, 0.6, 9), matNormal);
    fMesh.position.y = -0.3;
    modelGroup.add(fMesh);

    // 2. Columns
    const colGroup = new THREE.Group();
    modelGroup.add(colGroup);
    const colPositions = [
      [-4.5, -3.5], [0, -3.5], [4.5, -3.5],
      [-4.5, 0],    [0, 0],    [4.5, 0],
      [-4.5, 3.5],  [0, 3.5],  [4.5, 3.5],
    ];
    colPositions.forEach(([x, z]) => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.45, 8, 0.45), matNormal);
      col.position.set(x, 4, z);
      colGroup.add(col);
    });

    // 3. Beams
    const beamGroup = new THREE.Group();
    modelGroup.add(beamGroup);
    for (let lvl = 1; lvl <= 3; lvl++) {
      const y = lvl * 2.6;
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.35, 0.35), matSteel);
      b1.position.set(0, y, -3.5);
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.35, 0.35), matSteel);
      b2.position.set(0, y, 3.5);
      const b3 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 7.4), matSteel);
      b3.position.set(-4.5, y, 0);
      const b4 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 7.4), matSteel);
      b4.position.set(4.5, y, 0);
      beamGroup.add(b1, b2, b3, b4);
    }

    // 4. Slabs
    const slabGroup = new THREE.Group();
    modelGroup.add(slabGroup);
    for (let lvl = 1; lvl <= 3; lvl++) {
      const y = lvl * 2.6;
      const slab = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.25, 7.8), matNormal);
      slab.position.set(0, y, 0);
      slabGroup.add(slab);
    }

    // 5. Roof Truss
    const roofGroup = new THREE.Group();
    modelGroup.add(roofGroup);
    const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.35, 8.2), matNormal);
    roofSlab.position.set(0, 8.0, 0);
    roofGroup.add(roofSlab);

    // Mouse drag rotation
    let isDragging = false;
    let prevMouseX = 0;
    let rotY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      prevMouseX = e.clientX;
      rotY += dx * 0.008;
    };
    const onMouseUp = () => { isDragging = false; };

    const domEl = renderer.domElement;
    domEl.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    const animate = () => {
      if (!isAliveRef.current) return;

      const layer = activeLayerRef.current;

      // Highlight active layer, dim others
      fMesh.material = layer === "foundation" || layer === "complete" ? matActive : matDim;

      colGroup.children.forEach((c) => {
        (c as THREE.Mesh).material = layer === "columns" || layer === "complete" ? matActive : matDim;
      });

      beamGroup.children.forEach((b) => {
        (b as THREE.Mesh).material = layer === "beams" || layer === "complete" ? matActive : matDim;
      });

      slabGroup.children.forEach((s) => {
        (s as THREE.Mesh).material = layer === "slabs" || layer === "complete" ? matActive : matDim;
      });

      roofGroup.children.forEach((r) => {
        (r as THREE.Mesh).material = layer === "roof" || layer === "complete" ? matActive : matDim;
      });

      if (!isDragging) {
        rotY += 0.003;
      }
      modelGroup.rotation.y = rotY;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      isAliveRef.current = false;
      domEl.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize);
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`si-3d-viewport ${className}`}
      aria-label="3D interactive structural model"
    />
  );
}
