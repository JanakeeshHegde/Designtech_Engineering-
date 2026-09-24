import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ──────────────────────────────────────────────────────────
   HeroStructural3D
   Three.js WebGL Structural / BIM 3D Construction Visualization
   
   Stages:
   01 Blueprint & Grid Axes
   02 Raft Foundation & Footings
   03 RCC Columns Rising
   04 Beams & Moment Framing
   05 Floor Slabs (L1 - L5)
   06 Core Shear Walls
   07 Facade Fins & Tinted Glazing
   08 Roof Terrace & Parapets
   09 Site Landscaping
   10 Completed Model + 360° Continuous Orbit
────────────────────────────────────────────────────────── */

interface Props {
  className?: string;
}

export default function HeroStructural3D({ className = "" }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isAliveRef = useRef<boolean>(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    isAliveRef.current = true;

    // ── Three.js Scene Setup ──
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x171717, 0.015);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(28, 22, 32);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // ── Lighting ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunLight.position.set(30, 45, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -25;
    sunLight.shadow.camera.right = 25;
    sunLight.shadow.camera.top = 25;
    sunLight.shadow.camera.bottom = -25;
    scene.add(sunLight);

    const goldFillLight = new THREE.PointLight(0xa87524, 2.5, 50);
    goldFillLight.position.set(-15, 12, -15);
    scene.add(goldFillLight);

    // ── Materials ──
    const matGold = new THREE.MeshStandardMaterial({ color: 0xa87524, metalness: 0.6, roughness: 0.3 });
    const matConcrete = new THREE.MeshStandardMaterial({ color: 0xe5e1d8, roughness: 0.85, metalness: 0.1 });
    const matConcreteDark = new THREE.MeshStandardMaterial({ color: 0xbdb7ab, roughness: 0.9, metalness: 0.1 });
    const matSteel = new THREE.MeshStandardMaterial({ color: 0x4a5568, metalness: 0.8, roughness: 0.25 });
    const matGlass = new THREE.MeshPhysicalMaterial({
      color: 0x8cc3e1,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.85,
      thickness: 0.5,
      transparent: true,
      opacity: 0.65,
    });
    const matTree = new THREE.MeshStandardMaterial({ color: 0x5a7a48, roughness: 0.9 });
    const matTrunk = new THREE.MeshStandardMaterial({ color: 0x5a4230, roughness: 0.9 });

    // ── Root Building Group ──
    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);

    // ── Stage 1: Blueprint CAD Grid ──
    const gridHelper = new THREE.GridHelper(36, 18, 0xa87524, 0x444444);
    gridHelper.position.y = -0.05;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.45;
    buildingGroup.add(gridHelper);

    // ── Stage 2: Raft Foundation ──
    const foundationGeo = new THREE.BoxGeometry(18, 0.8, 14);
    const foundationMesh = new THREE.Mesh(foundationGeo, matConcreteDark);
    foundationMesh.position.y = -0.4;
    foundationMesh.receiveShadow = true;
    buildingGroup.add(foundationMesh);

    // ── Stage 3: Columns (3x3 Grid = 9 Columns) ──
    const columns: THREE.Mesh[] = [];
    const colGeo = new THREE.BoxGeometry(0.55, 12, 0.55);
    const colPositions: [number, number][] = [
      [-7, -5], [0, -5], [7, -5],
      [-7, 0],  [0, 0],  [7, 0],
      [-7, 5],  [0, 5],  [7, 5],
    ];

    colPositions.forEach(([x, z]) => {
      const col = new THREE.Mesh(colGeo, matConcrete);
      col.position.set(x, 6, z);
      col.castShadow = true;
      col.receiveShadow = true;
      col.scale.set(1, 0.001, 1);
      buildingGroup.add(col);
      columns.push(col);
    });

    // ── Stage 4: Floor Slabs & Beams ──
    const slabs: THREE.Mesh[] = [];
    const slabGeo = new THREE.BoxGeometry(16, 0.35, 12);

    for (let i = 1; i <= 4; i++) {
      const slab = new THREE.Mesh(slabGeo, matConcrete);
      slab.position.set(0, i * 2.8, 0);
      slab.castShadow = true;
      slab.receiveShadow = true;
      slab.scale.set(0.001, 1, 0.001);
      buildingGroup.add(slab);
      slabs.push(slab);
    }

    // ── Stage 5: Beams (Perimeter Frames) ──
    const beams: THREE.Mesh[] = [];
    const beamMat = matGold;

    for (let i = 1; i <= 4; i++) {
      const y = i * 2.8;
      // Longitudinal beams
      const bX1 = new THREE.Mesh(new THREE.BoxGeometry(14.5, 0.4, 0.4), beamMat);
      bX1.position.set(0, y, -5);
      const bX2 = new THREE.Mesh(new THREE.BoxGeometry(14.5, 0.4, 0.4), beamMat);
      bX2.position.set(0, y, 5);
      // Transverse beams
      const bZ1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 10.5), beamMat);
      bZ1.position.set(-7, y, 0);
      const bZ2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 10.5), beamMat);
      bZ2.position.set(7, y, 0);

      [bX1, bX2, bZ1, bZ2].forEach((b) => {
        b.scale.set(0.001, 1, 0.001);
        buildingGroup.add(b);
        beams.push(b);
      });
    }

    // ── Stage 6: Core Shear Wall ──
    const coreGeo = new THREE.BoxGeometry(3.5, 12, 3.5);
    const coreMesh = new THREE.Mesh(coreGeo, matConcrete);
    coreMesh.position.set(0, 6, 0);
    coreMesh.castShadow = true;
    coreMesh.receiveShadow = true;
    coreMesh.scale.set(1, 0.001, 1);
    buildingGroup.add(coreMesh);

    // ── Stage 7: Facade Curtain Glazing ──
    const glassPanels: THREE.Mesh[] = [];
    const glassGeo = new THREE.BoxGeometry(15.6, 11, 0.1);

    const glassFront = new THREE.Mesh(glassGeo, matGlass);
    glassFront.position.set(0, 5.8, 5.8);
    glassFront.scale.set(1, 0.001, 1);
    buildingGroup.add(glassFront);
    glassPanels.push(glassFront);

    // Gold Architectural Fins
    const fins: THREE.Mesh[] = [];
    for (let x = -6.5; x <= 6.5; x += 1.8) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.12, 11.2, 0.4), matGold);
      fin.position.set(x, 5.8, 6.0);
      fin.scale.set(1, 0.001, 1);
      buildingGroup.add(fin);
      fins.push(fin);
    }

    // ── Stage 8: Roof Terrace & Parapet ──
    const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(16.4, 0.45, 12.4), matConcrete);
    roofSlab.position.set(0, 11.6, 0);
    roofSlab.castShadow = true;
    roofSlab.scale.set(0.001, 1, 0.001);
    buildingGroup.add(roofSlab);

    const mepBox = new THREE.Mesh(new THREE.BoxGeometry(4, 1.8, 4), matSteel);
    mepBox.position.set(0, 12.7, 0);
    mepBox.scale.set(0.001, 0.001, 0.001);
    buildingGroup.add(mepBox);

    // ── Stage 9: Landscaping & Perimeter Trees ──
    const treeGroup = new THREE.Group();
    buildingGroup.add(treeGroup);

    const treePositions = [
      [-12, -8], [12, -8], [-12, 8], [12, 8],
      [-11, 0],  [11, 0],  [0, -9],
    ];

    treePositions.forEach(([tx, tz]) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 1.4), matTrunk);
      trunk.position.set(tx, 0.7, tz);
      const canopy = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2), matTree);
      canopy.position.set(tx, 2.0, tz);
      canopy.castShadow = true;

      const tMesh = new THREE.Group();
      tMesh.add(trunk);
      tMesh.add(canopy);
      tMesh.scale.set(0.001, 0.001, 0.001);
      treeGroup.add(tMesh);
    });

    // ── Mouse Parallax / Orbit State ──
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // ── Resize ──
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Animation Loop ──
    const TOTAL_TIME = 16000; // 16s sequence
    const ORBIT_SPEED = 0.00035;
    const startTime = performance.now();

    const animate = (now: number) => {
      if (!isAliveRef.current) return;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / TOTAL_TIME, 1);

      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // ── Stage 2: Foundation (0.05 -> 0.15) ──
      if (progress > 0.05) {
        const p = Math.min((progress - 0.05) / 0.1, 1);
        foundationMesh.scale.set(p, 1, p);
      }

      // ── Stage 3: Columns (0.15 -> 0.35) ──
      if (progress > 0.15) {
        const p = Math.min((progress - 0.15) / 0.2, 1);
        columns.forEach((col) => {
          col.scale.y = Math.max(0.001, p);
          col.position.y = (p * 12) / 2;
        });
        coreMesh.scale.y = Math.max(0.001, p);
        coreMesh.position.y = (p * 12) / 2;
      }

      // ── Stage 4: Beams & Slabs (0.3 -> 0.6) ──
      if (progress > 0.3) {
        const p = Math.min((progress - 0.3) / 0.3, 1);
        slabs.forEach((slab, idx) => {
          const sp = Math.min(Math.max((p - idx * 0.22) / 0.25, 0), 1);
          slab.scale.set(Math.max(0.001, sp), 1, Math.max(0.001, sp));
        });
        beams.forEach((beam) => {
          beam.scale.set(Math.max(0.001, p), 1, Math.max(0.001, p));
        });
      }

      // ── Stage 7: Facade & Glazing (0.55 -> 0.8) ──
      if (progress > 0.55) {
        const p = Math.min((progress - 0.55) / 0.25, 1);
        glassPanels.forEach((gp) => {
          gp.scale.y = Math.max(0.001, p);
        });
        fins.forEach((fin) => {
          fin.scale.y = Math.max(0.001, p);
        });
      }

      // ── Stage 8: Roof & MEP (0.75 -> 0.9) ──
      if (progress > 0.75) {
        const p = Math.min((progress - 0.75) / 0.15, 1);
        roofSlab.scale.set(Math.max(0.001, p), 1, Math.max(0.001, p));
        mepBox.scale.set(Math.max(0.001, p), Math.max(0.001, p), Math.max(0.001, p));
      }

      // ── Stage 9: Trees & Landscaping (0.85 -> 1.0) ──
      if (progress > 0.85) {
        const p = Math.min((progress - 0.85) / 0.15, 1);
        treeGroup.children.forEach((t) => {
          t.scale.set(p, p, p);
        });
      }

      // ── Camera Motion (Continuous 360 Orbit + Mouse Interaction) ──
      const radius = 38;
      const angle = progress >= 1 ? (elapsed - TOTAL_TIME) * ORBIT_SPEED : mouse.x * 0.3;
      const targetCamX = Math.sin(angle) * radius + mouse.x * 4;
      const targetCamZ = Math.cos(angle) * radius;
      const targetCamY = 20 - mouse.y * 6;

      camera.position.x += (targetCamX - camera.position.x) * 0.04;
      camera.position.y += (targetCamY - camera.position.y) * 0.04;
      camera.position.z += (targetCamZ - camera.position.z) * 0.04;
      camera.lookAt(0, 5.5, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      isAliveRef.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`hero-3d-viewport ${className}`}
      aria-hidden="true"
    />
  );
}
