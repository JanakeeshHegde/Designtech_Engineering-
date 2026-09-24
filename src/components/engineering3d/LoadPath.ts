import * as THREE from "three";
import { PILE_LOCATIONS } from "./PileFoundation";
import { COLUMN_LOCATIONS } from "./StructuralColumns";

export function createLoadPath() {
  const group = new THREE.Group();
  group.name = "load-path-group";

  // Warm amber structural load vector color
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xffa000,
    transparent: true,
    opacity: 0.85,
  });

  const arrowConeGeo = new THREE.ConeGeometry(0.32, 0.65, 16);
  arrowConeGeo.rotateX(Math.PI); // Point downward

  const arrowStemGeo = new THREE.CylinderGeometry(0.07, 0.07, 1.1, 12);

  // 1. Structural Column Load Vectors (Building Load -> Columns)
  const columnArrows: THREE.Group[] = [];
  COLUMN_LOCATIONS.forEach((col) => {
    const arrowGroup = new THREE.Group();
    const topY = 1.35 + col.height + 0.7;

    const stem = new THREE.Mesh(arrowStemGeo, glowMat);
    stem.position.set(0, 0.55, 0);
    arrowGroup.add(stem);

    const cone = new THREE.Mesh(arrowConeGeo, glowMat);
    cone.position.set(0, 0, 0);
    arrowGroup.add(cone);

    arrowGroup.position.set(col.x, topY, col.z);
    group.add(arrowGroup);
    columnArrows.push(arrowGroup);
  });

  // 2. Raft Soil Contact Pressure Vectors (Under Raft -> Compacted Sand)
  const raftPressureArrows: THREE.Group[] = [];
  const raftArrowConeGeo = new THREE.ConeGeometry(0.18, 0.35, 12);
  raftArrowConeGeo.rotateX(Math.PI);
  const raftArrowStemGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.55, 8);

  for (let rx = -7.2; rx <= 0.4; rx += 1.8) {
    for (let rz = -3.8; rz <= 3.2; rz += 1.8) {
      const arrowGroup = new THREE.Group();
      const stem = new THREE.Mesh(raftArrowStemGeo, glowMat);
      stem.position.set(0, 0.28, 0);
      arrowGroup.add(stem);

      const cone = new THREE.Mesh(raftArrowConeGeo, glowMat);
      cone.position.set(0, 0, 0);
      arrowGroup.add(cone);

      arrowGroup.position.set(rx, -0.6, rz);
      group.add(arrowGroup);
      raftPressureArrows.push(arrowGroup);
    }
  }

  // 3. Pile Shaft Downward Vectors
  const pileShaftArrows: THREE.Group[] = [];
  PILE_LOCATIONS.forEach((pile) => {
    [-3.2, -6.8, -10.2].forEach((depthY) => {
      const arrowGroup = new THREE.Group();
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.75, 8),
        glowMat
      );
      stem.position.set(0, 0.38, 0);
      arrowGroup.add(stem);

      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.2, 0.42, 12),
        glowMat
      );
      cone.rotateX(Math.PI);
      cone.position.set(0, 0, 0);
      arrowGroup.add(cone);

      arrowGroup.position.set(pile.x, depthY, pile.z);
      group.add(arrowGroup);
      pileShaftArrows.push(arrowGroup);
    });
  });

  // 4. End Bearing Radial Dissipation Vectors into Hard Rock Strata
  const endBearingArrows: THREE.Group[] = [];
  const tipConeGeo = new THREE.ConeGeometry(0.14, 0.3, 8);
  tipConeGeo.rotateX(Math.PI);
  const tipStemGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.48, 6);

  PILE_LOCATIONS.forEach((pile) => {
    const tipY = -pile.length;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const arrowGroup = new THREE.Group();

      const stem = new THREE.Mesh(tipStemGeo, glowMat);
      stem.position.set(0, 0.24, 0);
      arrowGroup.add(stem);

      const cone = new THREE.Mesh(tipConeGeo, glowMat);
      cone.position.set(0, 0, 0);
      arrowGroup.add(cone);

      arrowGroup.rotation.y = angle;
      arrowGroup.rotation.z = 0.58; // Outward angle
      arrowGroup.position.set(pile.x, tipY, pile.z);

      group.add(arrowGroup);
      endBearingArrows.push(arrowGroup);
    }
  });

  const update = (time: number) => {
    const pulse = 0.75 + 0.25 * Math.sin(time * 2.8);
    glowMat.opacity = pulse;

    columnArrows.forEach((arr, i) => {
      arr.position.y = 1.35 + 6.8 + 0.7 + 0.12 * Math.sin(time * 3.5 + i * 0.4);
    });

    raftPressureArrows.forEach((arr, i) => {
      arr.position.y = -0.6 + 0.06 * Math.sin(time * 2.8 + i * 0.25);
    });

    endBearingArrows.forEach((arr, i) => {
      const s = 0.92 + 0.16 * Math.sin(time * 3.5 + i * 0.35);
      arr.scale.set(s, s, s);
    });
  };

  return { group, update };
}
