import * as THREE from "three";

export interface ColumnLocation {
  x: number;
  z: number;
  height: number;
  label: string;
}

export const COLUMN_LOCATIONS: ColumnLocation[] = [
  // Columns over Raft Foundation (Left)
  { x: -6.2, z: 2.4, height: 6.8, label: "C1" },
  { x: -2.0, z: 2.4, height: 6.8, label: "C2" },
  { x: -6.2, z: -2.4, height: 6.8, label: "C3" },
  { x: -2.0, z: -2.4, height: 6.8, label: "C4" },

  // Columns over Pile Foundation (Right)
  { x: 2.8, z: 2.4, height: 6.8, label: "C5" },
  { x: 5.8, z: 2.4, height: 6.8, label: "C6" },
  { x: 2.8, z: -2.4, height: 6.8, label: "C7" },
  { x: 5.8, z: -2.4, height: 6.8, label: "C8" },
];

export function createStructuralColumns(textures: Record<string, THREE.Texture>, isBlueprint = false) {
  const group = new THREE.Group();
  group.name = "structural-columns-group";

  const colMat = isBlueprint
    ? new THREE.MeshBasicMaterial({ color: 0x4499ee, wireframe: true })
    : new THREE.MeshStandardMaterial({
        color: 0xe5e2db,
        roughness: 0.62,
        metalness: 0.05,
        map: textures.concrete || null,
        bumpMap: textures.concrete || null,
        bumpScale: 0.02,
      });

  const beamMat = isBlueprint
    ? new THREE.MeshBasicMaterial({ color: 0x3388dd, wireframe: true })
    : new THREE.MeshStandardMaterial({
        color: 0xdad6cd,
        roughness: 0.68,
        metalness: 0.08,
        map: textures.concrete || null,
      });

  const rebarMat = new THREE.MeshStandardMaterial({
    color: 0x222832,
    metalness: 0.95,
    roughness: 0.3,
  });

  const colWidth = 0.95;
  const baseY = 1.35; // Top of raft & pile cap

  // 1. Reinforced Concrete Columns
  COLUMN_LOCATIONS.forEach((col) => {
    const colGeo = new THREE.BoxGeometry(colWidth, col.height, colWidth);
    const colMesh = new THREE.Mesh(colGeo, colMat);
    colMesh.position.set(col.x, baseY + col.height / 2, col.z);
    colMesh.castShadow = true;
    colMesh.receiveShadow = true;
    group.add(colMesh);

    // Beveled Column Edges
    const edgeLines = new THREE.LineSegments(
      new THREE.EdgesGeometry(colGeo),
      new THREE.LineBasicMaterial({ color: 0x4a5568, transparent: true, opacity: 0.45 })
    );
    edgeLines.position.copy(colMesh.position);
    group.add(edgeLines);

    // Vertical Rebar Starters projecting out from column tops
    if (!isBlueprint) {
      const topColY = baseY + col.height;
      for (let i = 0; i < 4; i++) {
        const ox = (i % 2 === 0 ? -1 : 1) * (colWidth / 2 - 0.14);
        const oz = (i < 2 ? -1 : 1) * (colWidth / 2 - 0.14);
        const barGeo = new THREE.CylinderGeometry(0.024, 0.024, 1.4, 8);
        const bar = new THREE.Mesh(barGeo, rebarMat);
        bar.position.set(col.x + ox, topColY + 0.7, col.z + oz);
        bar.castShadow = true;
        group.add(bar);
      }
      // Rebar tie hoop
      const tieGeo = new THREE.BoxGeometry(colWidth - 0.18, 0.035, colWidth - 0.18);
      const tieLine = new THREE.LineSegments(
        new THREE.EdgesGeometry(tieGeo),
        new THREE.LineBasicMaterial({ color: 0x111827, linewidth: 2 })
      );
      tieLine.position.set(col.x, topColY + 0.45, col.z);
      group.add(tieLine);
    }
  });

  // 2. Framing Beams and Floor Slabs at Intermediate Levels
  const levels = [baseY + 3.4, baseY + 6.6];
  levels.forEach((lvlY) => {
    // Left Grid Beams
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.5, 0.5), beamMat);
    b1.position.set(-4.1, lvlY, 2.4);
    b1.castShadow = true;
    group.add(b1);

    const b2 = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.5, 0.5), beamMat);
    b2.position.set(-4.1, lvlY, -2.4);
    b2.castShadow = true;
    group.add(b2);

    const b3 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 4.8), beamMat);
    b3.position.set(-6.2, lvlY, 0);
    b3.castShadow = true;
    group.add(b3);

    const b4 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 4.8), beamMat);
    b4.position.set(-2.0, lvlY, 0);
    b4.castShadow = true;
    group.add(b4);

    // Right Grid Beams
    const b5 = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.5, 0.5), beamMat);
    b5.position.set(4.3, lvlY, 2.4);
    b5.castShadow = true;
    group.add(b5);

    const b6 = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.5, 0.5), beamMat);
    b6.position.set(4.3, lvlY, -2.4);
    b6.castShadow = true;
    group.add(b6);

    const b7 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 4.8), beamMat);
    b7.position.set(2.8, lvlY, 0);
    b7.castShadow = true;
    group.add(b7);

    const b8 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 4.8), beamMat);
    b8.position.set(5.8, lvlY, 0);
    b8.castShadow = true;
    group.add(b8);

    // Partial Floor Slab Deck
    const slabMesh = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.22, 4.2), beamMat);
    slabMesh.position.set(-4.1, lvlY - 0.12, 0);
    slabMesh.castShadow = true;
    group.add(slabMesh);
  });

  return group;
}
