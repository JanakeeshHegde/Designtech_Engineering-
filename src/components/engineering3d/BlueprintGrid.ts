import * as THREE from "three";

export function createBlueprintGrid() {
  const group = new THREE.Group();
  group.name = "blueprint-grid-group";

  // Base ground grid
  const gridHelper = new THREE.GridHelper(24, 16, 0xa87524, 0x4a5568);
  gridHelper.position.y = 0.01;
  (gridHelper.material as THREE.Material).transparent = true;
  (gridHelper.material as THREE.Material).opacity = 0.3;
  group.add(gridHelper);

  // Elevation datum reference lines (Engineering Cutaway Levels)
  const datums = [
    { y: 0.0, label: "GL ±0.00" },
    { y: -2.2, label: "-2.20m SAND" },
    { y: -4.5, label: "-4.50m CLAY" },
    { y: -7.5, label: "-7.50m ROCK" },
    { y: -10.5, label: "-10.50m BEARING" },
  ];

  const lineMat = new THREE.LineDashedMaterial({
    color: 0xa87524,
    dashSize: 0.4,
    gapSize: 0.2,
    transparent: true,
    opacity: 0.4,
  });

  datums.forEach((datum) => {
    const points = [
      new THREE.Vector3(-10, datum.y, -7.5),
      new THREE.Vector3(10, datum.y, -7.5),
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geo, lineMat);
    line.computeLineDistances();
    group.add(line);
  });

  return group;
}
