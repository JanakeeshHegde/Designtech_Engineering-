import * as THREE from "three";

export function createRaftFoundation(textures: Record<string, THREE.Texture>, isBlueprint = false) {
  const group = new THREE.Group();
  group.name = "raft-foundation-group";

  const raftWidth = 8.8;
  const raftDepth = 8.8;
  const raftHeight = 1.35;
  const raftCenterX = -3.4;
  const raftCenterZ = -0.4;
  const raftCenterY = raftHeight / 2; // Sits directly on ground plane y=0

  // Materials
  const raftMat = isBlueprint
    ? new THREE.MeshBasicMaterial({ color: 0x2266aa, wireframe: true })
    : new THREE.MeshStandardMaterial({
        color: 0xe2ded7,
        roughness: 0.65,
        metalness: 0.08,
        map: textures.concrete || null,
        bumpMap: textures.concrete || null,
        bumpScale: 0.03,
      });

  const rebarMat = new THREE.MeshStandardMaterial({
    color: 0x272c35,
    metalness: 0.94,
    roughness: 0.28,
  });

  // 1. Concrete Raft Slab
  const raftGeo = new THREE.BoxGeometry(raftWidth, raftHeight, raftDepth);
  const raftMesh = new THREE.Mesh(raftGeo, raftMat);
  raftMesh.position.set(raftCenterX, raftCenterY, raftCenterZ);
  raftMesh.castShadow = true;
  raftMesh.receiveShadow = true;
  group.add(raftMesh);

  // Beveled Edge Lines
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x5a6578, transparent: true, opacity: 0.5 });
  const edgeLines = new THREE.LineSegments(new THREE.EdgesGeometry(raftGeo), edgeMat);
  edgeLines.position.copy(raftMesh.position);
  group.add(edgeLines);

  // 2. High-precision Top Rebar Mesh Grid (Matching foundation.png)
  if (!isBlueprint) {
    const rebarGroup = new THREE.Group();
    rebarGroup.name = "raft-rebar-mesh";

    const topY = raftHeight + 0.06;
    const meshHalfW = raftWidth / 2 - 0.4;
    const meshHalfD = raftDepth / 2 - 0.4;

    // Longitudinal bars (X direction)
    const numZ = 14;
    for (let i = 0; i < numZ; i++) {
      const z = raftCenterZ - meshHalfD + (i / (numZ - 1)) * (meshHalfD * 2);
      const barGeo = new THREE.CylinderGeometry(0.024, 0.024, raftWidth - 0.8, 8);
      barGeo.rotateZ(Math.PI / 2);
      const bar = new THREE.Mesh(barGeo, rebarMat);
      bar.position.set(raftCenterX, topY, z);
      bar.castShadow = true;
      rebarGroup.add(bar);
    }

    // Transverse bars (Z direction)
    const numX = 14;
    for (let i = 0; i < numX; i++) {
      const x = raftCenterX - meshHalfW + (i / (numX - 1)) * (meshHalfW * 2);
      const barGeo = new THREE.CylinderGeometry(0.024, 0.024, raftDepth - 0.8, 8);
      barGeo.rotateX(Math.PI / 2);
      const bar = new THREE.Mesh(barGeo, rebarMat);
      bar.position.set(x, topY + 0.03, raftCenterZ);
      bar.castShadow = true;
      rebarGroup.add(bar);
    }

    // Rebar perimeter containment line
    const pPoints = [
      new THREE.Vector3(raftCenterX - meshHalfW, topY + 0.04, raftCenterZ - meshHalfD),
      new THREE.Vector3(raftCenterX + meshHalfW, topY + 0.04, raftCenterZ - meshHalfD),
      new THREE.Vector3(raftCenterX + meshHalfW, topY + 0.04, raftCenterZ + meshHalfD),
      new THREE.Vector3(raftCenterX - meshHalfW, topY + 0.04, raftCenterZ + meshHalfD),
      new THREE.Vector3(raftCenterX - meshHalfW, topY + 0.04, raftCenterZ - meshHalfD),
    ];
    const pGeo = new THREE.BufferGeometry().setFromPoints(pPoints);
    const pLine = new THREE.Line(pGeo, new THREE.LineBasicMaterial({ color: 0x1a202c, linewidth: 2 }));
    rebarGroup.add(pLine);

    group.add(rebarGroup);
  }

  // 3. Compacted Sand/Granular Bedding Layer directly beneath Raft
  const bedMat = new THREE.MeshStandardMaterial({
    color: 0xd4a860,
    roughness: 0.92,
    map: textures.sand || null,
  });
  const bedGeo = new THREE.BoxGeometry(raftWidth + 0.5, 0.35, raftDepth + 0.5);
  const bedMesh = new THREE.Mesh(bedGeo, bedMat);
  bedMesh.position.set(raftCenterX, -0.175, raftCenterZ);
  bedMesh.receiveShadow = true;
  group.add(bedMesh);

  return group;
}
