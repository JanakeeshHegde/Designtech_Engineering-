import * as THREE from "three";

export interface PilePosition {
  x: number;
  z: number;
  diameter: number;
  length: number;
}

// 6 Bored Cylindrical Cast-in-Situ Reinforced Concrete Piles
export const PILE_LOCATIONS: PilePosition[] = [
  { x: 2.8, z: 2.8, diameter: 1.25, length: 12.0 },
  { x: 5.8, z: 2.8, diameter: 1.25, length: 12.0 },
  { x: 2.8, z: -0.2, diameter: 1.25, length: 12.0 },
  { x: 5.8, z: -0.2, diameter: 1.25, length: 12.0 },
  { x: 2.8, z: -3.4, diameter: 1.25, length: 12.0 },
  { x: 5.8, z: -3.4, diameter: 1.25, length: 12.0 },
];

export function createPileFoundation(textures: Record<string, THREE.Texture>, isBlueprint = false) {
  const group = new THREE.Group();
  group.name = "pile-foundation-group";

  // Materials
  const pileMat = isBlueprint
    ? new THREE.MeshBasicMaterial({ color: 0x3388cc, wireframe: true })
    : new THREE.MeshStandardMaterial({
        color: 0xd8d4cb,
        roughness: 0.72,
        metalness: 0.08,
        map: textures.concrete_rough || textures.concrete || null,
        bumpMap: textures.concrete_rough || textures.concrete || null,
        bumpScale: 0.05,
      });

  const rebarMat = new THREE.MeshStandardMaterial({
    color: 0x2b303a,
    metalness: 0.92,
    roughness: 0.3,
  });

  const pileCapMat = isBlueprint
    ? new THREE.MeshBasicMaterial({ color: 0x4499dd, wireframe: true })
    : new THREE.MeshStandardMaterial({
        color: 0xe0ddd6,
        roughness: 0.68,
        metalness: 0.08,
        map: textures.concrete || null,
        bumpMap: textures.concrete || null,
        bumpScale: 0.03,
      });

  // 1. Concrete Piles
  PILE_LOCATIONS.forEach((pile, index) => {
    const pileGroup = new THREE.Group();
    pileGroup.name = `pile-shaft-${index + 1}`;

    const radius = pile.diameter / 2;
    const height = pile.length;
    const pileGeo = new THREE.CylinderGeometry(radius, radius, height, 32);
    const pileMesh = new THREE.Mesh(pileGeo, pileMat);
    pileMesh.position.set(0, -height / 2, 0);
    pileMesh.castShadow = true;
    pileMesh.receiveShadow = true;
    pileGroup.add(pileMesh);

    // Beveled pile collar at head connection
    if (!isBlueprint) {
      const collarGeo = new THREE.CylinderGeometry(radius * 1.08, radius, 0.35, 32);
      const collar = new THREE.Mesh(collarGeo, pileMat);
      collar.position.set(0, -0.175, 0);
      collar.castShadow = true;
      pileGroup.add(collar);

      // Rebar dowels and cage exposed at pile bottom embedded in bedrock
      const cageGroup = new THREE.Group();
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const rx = Math.cos(angle) * (radius * 0.78);
        const rz = Math.sin(angle) * (radius * 0.78);
        const barGeo = new THREE.CylinderGeometry(0.022, 0.022, 1.2, 8);
        const bar = new THREE.Mesh(barGeo, rebarMat);
        bar.position.set(rx, -height - 0.3, rz);
        cageGroup.add(bar);
      }
      // Rebar bottom anchor hoop
      const hoopGeo = new THREE.TorusGeometry(radius * 0.82, 0.025, 8, 28);
      hoopGeo.rotateX(Math.PI / 2);
      const hoop = new THREE.Mesh(hoopGeo, rebarMat);
      hoop.position.set(0, -height + 0.2, 0);
      cageGroup.add(hoop);
      pileGroup.add(cageGroup);
    }

    pileGroup.position.set(pile.x, 0, pile.z);
    group.add(pileGroup);
  });

  // 2. Reinforced Concrete Pile Cap (Thick continuous structural block connecting pile heads)
  const capWidth = 4.8;
  const capHeight = 1.35;
  const capDepth = 8.8;
  const capGeo = new THREE.BoxGeometry(capWidth, capHeight, capDepth);
  const capMesh = new THREE.Mesh(capGeo, pileCapMat);
  capMesh.position.set(4.3, capHeight / 2, -0.4);
  capMesh.castShadow = true;
  capMesh.receiveShadow = true;
  group.add(capMesh);

  // Pile cap beveled edges
  const capEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(capGeo),
    new THREE.LineBasicMaterial({ color: 0x5a6578, transparent: true, opacity: 0.5 })
  );
  capEdges.position.copy(capMesh.position);
  group.add(capEdges);

  return group;
}
