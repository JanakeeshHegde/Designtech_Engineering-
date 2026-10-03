import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
  className?: string;
  variant?: "tower" | "pavilion" | "frame";
  height?: number | string;
}

export default function ArchitecturalStructureCanvas({
  className = "",
  variant = "tower",
  height = "100%",
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dimensions
    const width = container.clientWidth || 400;
    const heightPx = container.clientHeight || 400;

    // Scene setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / heightPx, 0.1, 100);
    camera.position.set(7, 6, 9);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    // Architectural Lighting (Light, warm architectural ambiance)
    const ambientLight = new THREE.AmbientLight(0xFFFAF2, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFF5E4, 1.8);
    sunLight.position.set(10, 15, 8);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xE0E6F0, 0.8);
    fillLight.position.set(-8, 5, -6);
    scene.add(fillLight);

    // Root Group for structural model
    const structureGroup = new THREE.Group();
    scene.add(structureGroup);

    // Materials: Light concrete & Bronze architectural edges
    const slabMaterial = new THREE.MeshStandardMaterial({
      color: 0xF2ECE1,
      roughness: 0.75,
      metalness: 0.05,
      transparent: true,
      opacity: 0.92,
    });

    const columnMaterial = new THREE.MeshStandardMaterial({
      color: 0xDDD6C8,
      roughness: 0.6,
      metalness: 0.1,
    });

    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xB78736,
      transparent: true,
      opacity: 0.65,
    });

    const steelWireMaterial = new THREE.LineBasicMaterial({
      color: 0x9E7530,
      transparent: true,
      opacity: 0.45,
    });

    const disposables: (THREE.BufferGeometry | THREE.Material)[] = [
      slabMaterial,
      columnMaterial,
      edgeMaterial,
      steelWireMaterial,
    ];

    // Build Structural Massing based on variant
    if (variant === "tower") {
      // Multi-tier stepped structural tower
      const floors = 6;
      const floorHeight = 0.7;
      const baseWidth = 3.6;
      const baseDepth = 3.2;

      for (let i = 0; i < floors; i++) {
        const factor = 1 - (i * 0.09);
        const w = baseWidth * factor;
        const d = baseDepth * factor;
        const y = i * floorHeight;

        // Floor Slab
        const slabGeo = new THREE.BoxGeometry(w, 0.08, d);
        disposables.push(slabGeo);
        const slabMesh = new THREE.Mesh(slabGeo, slabMaterial);
        slabMesh.position.set(0, y, 0);
        structureGroup.add(slabMesh);

        // Edge highlights
        const edgeGeo = new THREE.EdgesGeometry(slabGeo);
        disposables.push(edgeGeo);
        const edgeMesh = new THREE.LineSegments(edgeGeo, edgeMaterial);
        edgeMesh.position.set(0, y, 0);
        structureGroup.add(edgeMesh);

        // Columns below next floor
        if (i < floors - 1) {
          const colHeight = floorHeight - 0.08;
          const colX = (w * 0.45);
          const colZ = (d * 0.45);
          const colCoords = [
            [-colX, -colZ],
            [colX, -colZ],
            [-colX, colZ],
            [colX, colZ],
            [0, -colZ],
            [0, colZ],
          ];

          colCoords.forEach(([cx, cz]) => {
            const colGeo = new THREE.BoxGeometry(0.1, colHeight, 0.1);
            disposables.push(colGeo);
            const colMesh = new THREE.Mesh(colGeo, columnMaterial);
            colMesh.position.set(cx, y + colHeight / 2 + 0.04, cz);
            structureGroup.add(colMesh);

            const colEdgeGeo = new THREE.EdgesGeometry(colGeo);
            disposables.push(colEdgeGeo);
            const colEdge = new THREE.LineSegments(colEdgeGeo, edgeMaterial);
            colEdge.position.set(cx, y + colHeight / 2 + 0.04, cz);
            structureGroup.add(colEdge);
          });
        }
      }

      // Central Shear Core
      const coreGeo = new THREE.BoxGeometry(1.2, floors * floorHeight, 1.2);
      disposables.push(coreGeo);
      const coreMesh = new THREE.Mesh(
        coreGeo,
        new THREE.MeshStandardMaterial({
          color: 0xE8E1D3,
          roughness: 0.9,
          transparent: true,
          opacity: 0.85,
        })
      );
      coreMesh.position.set(0, (floors * floorHeight) / 2 - 0.04, 0);
      structureGroup.add(coreMesh);
      const coreEdgeGeo = new THREE.EdgesGeometry(coreGeo);
      disposables.push(coreEdgeGeo);
      const coreEdge = new THREE.LineSegments(coreEdgeGeo, edgeMaterial);
      coreEdge.position.copy(coreMesh.position);
      structureGroup.add(coreEdge);

      // Structural foundation pad
      const padGeo = new THREE.BoxGeometry(4.4, 0.2, 4.0);
      disposables.push(padGeo);
      const padMesh = new THREE.Mesh(padGeo, slabMaterial);
      padMesh.position.set(0, -0.15, 0);
      structureGroup.add(padMesh);
      const padEdgeGeo = new THREE.EdgesGeometry(padGeo);
      disposables.push(padEdgeGeo);
      const padEdge = new THREE.LineSegments(padEdgeGeo, edgeMaterial);
      padEdge.position.copy(padMesh.position);
      structureGroup.add(padEdge);

      structureGroup.position.set(0, -1.2, 0);
    } else if (variant === "pavilion") {
      // Long-span structural portal frame & trusses
      const span = 4.6;
      const depth = 4.0;
      const heightVal = 2.4;

      // Base slab
      const slabGeo = new THREE.BoxGeometry(span + 0.6, 0.1, depth + 0.6);
      disposables.push(slabGeo);
      const slabMesh = new THREE.Mesh(slabGeo, slabMaterial);
      slabMesh.position.set(0, -0.05, 0);
      structureGroup.add(slabMesh);

      // Portal frames (3 bays)
      const bays = 4;
      for (let b = 0; b < bays; b++) {
        const z = -depth / 2 + (b * depth) / (bays - 1);

        // Columns
        [-span / 2, span / 2].forEach((x) => {
          const colGeo = new THREE.BoxGeometry(0.14, heightVal, 0.14);
          disposables.push(colGeo);
          const colMesh = new THREE.Mesh(colGeo, columnMaterial);
          colMesh.position.set(x, heightVal / 2, z);
          structureGroup.add(colMesh);

          const colEdgeGeo = new THREE.EdgesGeometry(colGeo);
          disposables.push(colEdgeGeo);
          const colEdge = new THREE.LineSegments(colEdgeGeo, edgeMaterial);
          colEdge.position.copy(colMesh.position);
          structureGroup.add(colEdge);
        });

        // Roof Rafer / Truss Top Chord
        const points = [
          new THREE.Vector3(-span / 2, heightVal, z),
          new THREE.Vector3(0, heightVal + 0.7, z),
          new THREE.Vector3(span / 2, heightVal, z),
          new THREE.Vector3(0, heightVal + 0.2, z),
          new THREE.Vector3(-span / 2, heightVal, z),
        ];
        const trussGeo = new THREE.BufferGeometry().setFromPoints(points);
        disposables.push(trussGeo);
        const trussLine = new THREE.Line(trussGeo, steelWireMaterial);
        structureGroup.add(trussLine);
      }

      // Roof Canopy Slab
      const roofGeo = new THREE.BoxGeometry(span + 0.8, 0.06, depth + 0.8);
      disposables.push(roofGeo);
      const roofMesh = new THREE.Mesh(roofGeo, slabMaterial);
      roofMesh.position.set(0, heightVal + 0.55, 0);
      structureGroup.add(roofMesh);

      structureGroup.position.set(0, -0.8, 0);
    } else {
      // Spatial Structural Grid Frame
      const size = 3.2;
      const count = 3;
      const step = size / (count - 1);

      for (let x = 0; x < count; x++) {
        for (let y = 0; y < count; y++) {
          for (let z = 0; z < count; z++) {
            const px = -size / 2 + x * step;
            const py = y * step;
            const pz = -size / 2 + z * step;

            const nodeGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
            disposables.push(nodeGeo);
            const nodeMesh = new THREE.Mesh(nodeGeo, slabMaterial);
            nodeMesh.position.set(px, py, pz);
            structureGroup.add(nodeMesh);
          }
        }
      }

      const gridBoxGeo = new THREE.BoxGeometry(size, size, size);
      disposables.push(gridBoxGeo);
      const gridEdgesGeo = new THREE.EdgesGeometry(gridBoxGeo);
      disposables.push(gridEdgesGeo);
      const gridEdges = new THREE.LineSegments(gridEdgesGeo, edgeMaterial);
      gridEdges.position.set(0, size / 2, 0);
      structureGroup.add(gridEdges);

      structureGroup.position.set(0, -0.6, 0);
    }

    // Interaction & Animation Loop
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let isVisible = true;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.45;
      mouseY = y * 0.3;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // IntersectionObserver to freeze canvas when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Render loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      if (!prefersReducedMotion) {
        targetRotationY = mouseX * 0.5;
        targetRotationX = mouseY * 0.3;

        structureGroup.rotation.y += 0.0035 + targetRotationY * 0.02;
        structureGroup.rotation.x += (targetRotationX - structureGroup.rotation.x) * 0.05;
        camera.position.x += (Math.sin(structureGroup.rotation.y * 0.5) * 0.2 - camera.position.x + 7) * 0.02;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 300;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      resizeObserver.disconnect();

      disposables.forEach((item) => {
        if ("dispose" in item && typeof item.dispose === "function") {
          item.dispose();
        }
      });

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [variant]);

  return (
    <div
      ref={mountRef}
      className={`arch-3d-canvas-wrap ${className}`}
      style={{
        width: "100%",
        height,
        position: "relative",
        overflow: "hidden",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
