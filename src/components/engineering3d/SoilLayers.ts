import * as THREE from "three";

export interface SoilLayerConfig {
  name: string;
  depthLabel: string;
  yMin: number;
  yMax: number;
  color: number;
  roughness: number;
  textureType: "soil" | "sand" | "clay" | "weathered" | "bedrock";
}

export const SOIL_STRATA_CONFIG: SoilLayerConfig[] = [
  { name: "Topsoil / Organic Loam", depthLabel: "GL 0.00m to -0.80m", yMin: -0.8, yMax: 0.0, color: 0x332217, roughness: 0.95, textureType: "soil" },
  { name: "Compacted Granular Sand", depthLabel: "-0.80m to -2.20m", yMin: -2.2, yMax: -0.8, color: 0xcb9f5e, roughness: 0.88, textureType: "sand" },
  { name: "Medium Dense Sand", depthLabel: "-2.20m to -4.50m", yMin: -4.5, yMax: -2.2, color: 0xb5894b, roughness: 0.85, textureType: "sand" },
  { name: "Stiff Silty Clay", depthLabel: "-4.50m to -7.50m", yMin: -7.5, yMax: -4.5, color: 0x8a4724, roughness: 0.82, textureType: "clay" },
  { name: "Weathered Fractured Rock", depthLabel: "-7.50m to -10.50m", yMin: -10.5, yMax: -7.5, color: 0x5c5044, roughness: 0.9, textureType: "weathered" },
  { name: "Hard Bearing Strata (Rock)", depthLabel: "-10.50m to -14.00m (End Bearing)", yMin: -14.0, yMax: -10.5, color: 0x1e2229, roughness: 0.65, textureType: "bedrock" },
];

export function createSoilLayers(textures: Record<string, THREE.Texture>, isBlueprint = false) {
  const group = new THREE.Group();
  group.name = "soil-strata-group";

  const blockWidth = 17;
  const blockDepth = 13.5;

  SOIL_STRATA_CONFIG.forEach((layer) => {
    const height = layer.yMax - layer.yMin;
    const centerY = layer.yMin + height / 2;

    // Cutaway Soil Block: Left side solid under Raft, Back solid, Front-Right stepped to expose buried piles entering rock
    const layerGroup = new THREE.Group();
    layerGroup.name = `strata-${layer.textureType}`;

    // Left main block (beneath raft foundation)
    const leftWidth = 9.5;
    const leftX = -blockWidth / 2 + leftWidth / 2;
    const leftGeom = new THREE.BoxGeometry(leftWidth, height, blockDepth);

    // Back right block
    const rightWidth = blockWidth - leftWidth;
    const backDepth = 6.5;
    const rightX = blockWidth / 2 - rightWidth / 2;
    const backZ = -blockDepth / 2 + backDepth / 2;
    const backGeom = new THREE.BoxGeometry(rightWidth, height, backDepth);

    const mat = isBlueprint
      ? new THREE.MeshBasicMaterial({
          color: layer.textureType === "bedrock" ? 0xa87524 : 0x778899,
          wireframe: true,
          transparent: true,
          opacity: 0.2,
        })
      : new THREE.MeshStandardMaterial({
          color: layer.color,
          roughness: layer.roughness,
          metalness: layer.textureType === "bedrock" ? 0.15 : 0.02,
          map: textures[layer.textureType] || null,
          bumpMap: textures[layer.textureType] || null,
          bumpScale: layer.textureType === "bedrock" ? 0.12 : 0.04,
        });

    const leftMesh = new THREE.Mesh(leftGeom, mat);
    leftMesh.position.set(leftX, centerY, 0);
    leftMesh.receiveShadow = true;
    leftMesh.castShadow = true;
    layerGroup.add(leftMesh);

    const backMesh = new THREE.Mesh(backGeom, mat);
    backMesh.position.set(rightX, centerY, backZ);
    backMesh.receiveShadow = true;
    backMesh.castShadow = true;
    layerGroup.add(backMesh);

    // For bearing bedrock (base layer), create full base rock bed
    if (layer.textureType === "bedrock") {
      const frontRightBedrockGeom = new THREE.BoxGeometry(rightWidth, height, blockDepth - backDepth);
      const frontRightBedrockMesh = new THREE.Mesh(frontRightBedrockGeom, mat);
      frontRightBedrockMesh.position.set(rightX, centerY, blockDepth / 2 - (blockDepth - backDepth) / 2);
      frontRightBedrockMesh.receiveShadow = true;
      layerGroup.add(frontRightBedrockMesh);
    }

    // Boundary edge lines
    const lineMat = new THREE.LineBasicMaterial({
      color: layer.textureType === "bedrock" ? 0xa87524 : 0x2d3748,
      transparent: true,
      opacity: 0.35,
    });
    const leftEdges = new THREE.LineSegments(new THREE.EdgesGeometry(leftGeom), lineMat);
    leftEdges.position.copy(leftMesh.position);
    layerGroup.add(leftEdges);

    group.add(layerGroup);
  });

  // Top surface grass trim
  if (!isBlueprint) {
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x3d5423,
      roughness: 0.95,
      bumpScale: 0.05,
    });
    // Left grass rim
    const leftGrass = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.12, 13.5), grassMat);
    leftGrass.position.set(-8.5 + 4.75, 0.06, 0);
    group.add(leftGrass);

    // Back right grass rim
    const rightGrass = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.12, 6.5), grassMat);
    rightGrass.position.set(8.5 - 3.75, 0.06, -6.75 + 3.25);
    group.add(rightGrass);
  }

  return group;
}
