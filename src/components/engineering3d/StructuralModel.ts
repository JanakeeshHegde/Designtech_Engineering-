import * as THREE from "three";
import { createLayerTextures } from "./textures";
import { createSoilLayers } from "./SoilLayers";
import { createPileFoundation, PILE_LOCATIONS } from "./PileFoundation";
import { createRaftFoundation } from "./RaftFoundation";
import { COLUMN_LOCATIONS } from "./StructuralColumns";
import { createBlueprintGrid } from "./BlueprintGrid";

export type StructuralLayerId = "foundation" | "columns" | "beams" | "slabs" | "roof" | "complete";

export interface StructuralModelOptions {
  isBlueprint?: boolean;
  showLoadPath?: boolean;
  activeLayer?: StructuralLayerId;
}

export interface StructuralModelInstance {
  group: THREE.Group;
  update: (time: number, delta: number) => void;
  setBlueprintMode: (isBlueprint: boolean) => void;
  setShowLoadPath: (show: boolean) => void;
  setActiveLayer: (layer: StructuralLayerId) => void;
  getVisibleBounds: () => THREE.Box3;
  dispose: () => void;
}

export function createStructuralModel(options: StructuralModelOptions = {}): StructuralModelInstance {
  const rootGroup = new THREE.Group();
  rootGroup.name = "structural-bim-model";

  const textures = createLayerTextures();

  let isBlueprint = !!options.isBlueprint;
  let showLoadPath = options.showLoadPath ?? false;
  let activeLayer: StructuralLayerId = options.activeLayer ?? "complete";

  let soilGroup = createSoilLayers(textures, isBlueprint);
  let pileGroup = createPileFoundation(textures, isBlueprint);
  let raftGroup = createRaftFoundation(textures, isBlueprint);
  let blueprintGrid = createBlueprintGrid();

  let colGroup = new THREE.Group();
  colGroup.name = "bim-columns-group";
  let beamGroup = new THREE.Group();
  beamGroup.name = "bim-beams-group";
  let slabGroup = new THREE.Group();
  slabGroup.name = "bim-slabs-group";
  let roofGroup = new THREE.Group();
  roofGroup.name = "bim-roof-group";
  let loadPathGroup = new THREE.Group();
  loadPathGroup.name = "bim-loadpath-group";

  let columnArrows: THREE.Group[] = [];
  let raftPressureArrows: THREE.Group[] = [];
  let endBearingArrows: THREE.Group[] = [];
  let glowMat: THREE.MeshBasicMaterial;

  const buildSuperstructure = (blueprint: boolean) => {
    colGroup.clear();
    beamGroup.clear();
    slabGroup.clear();
    roofGroup.clear();
    loadPathGroup.clear();
    columnArrows = [];
    raftPressureArrows = [];
    endBearingArrows = [];

    // Realistic BIM Materials
    const colMat = blueprint
      ? new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true })
      : new THREE.MeshStandardMaterial({
          color: 0xe5e2db,
          roughness: 0.62,
          metalness: 0.05,
          map: textures.concrete || null,
          bumpMap: textures.concrete || null,
          bumpScale: 0.02,
        });

    const beamMat = blueprint
      ? new THREE.MeshBasicMaterial({ color: 0x2563eb, wireframe: true })
      : new THREE.MeshStandardMaterial({
          color: 0xdad6cd,
          roughness: 0.68,
          metalness: 0.08,
          map: textures.concrete || null,
        });

    const slabMat = blueprint
      ? new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true, transparent: true, opacity: 0.5 })
      : new THREE.MeshStandardMaterial({
          color: 0xe2dfd8,
          roughness: 0.7,
          metalness: 0.06,
          map: textures.concrete || null,
        });

    const steelFramingMat = blueprint
      ? new THREE.MeshBasicMaterial({ color: 0x2563eb, wireframe: true })
      : new THREE.MeshStandardMaterial({
          color: 0x334155,
          roughness: 0.35,
          metalness: 0.85,
        });

    const steelGussetMat = blueprint
      ? new THREE.MeshBasicMaterial({ color: 0x1d4ed8, wireframe: true })
      : new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          roughness: 0.28,
          metalness: 0.9,
        });

    const roofPanelMat = blueprint
      ? new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true, transparent: true, opacity: 0.45 })
      : new THREE.MeshStandardMaterial({
          color: 0x2c3440,
          roughness: 0.42,
          metalness: 0.72,
          map: (textures as any).steel_roof || null,
          bumpMap: (textures as any).steel_roof || null,
          bumpScale: 0.03,
          side: THREE.DoubleSide,
        });

    const roofTranslucentMat = blueprint
      ? new THREE.MeshBasicMaterial({ color: 0x93c5fd, wireframe: true, transparent: true, opacity: 0.35 })
      : new THREE.MeshStandardMaterial({
          color: 0x384556,
          roughness: 0.3,
          metalness: 0.5,
          transparent: true,
          opacity: 0.72,
          side: THREE.DoubleSide,
        });

    const rebarMat = new THREE.MeshStandardMaterial({
      color: 0x222832,
      metalness: 0.95,
      roughness: 0.3,
    });

    const colWidth = 0.95;
    const baseY = 1.35;
    const colTopY = baseY + 6.8; // 8.15m

    // 1. Columns
    COLUMN_LOCATIONS.forEach((col) => {
      const colGeo = new THREE.BoxGeometry(colWidth, col.height, colWidth);
      const colMesh = new THREE.Mesh(colGeo, colMat);
      colMesh.position.set(col.x, baseY + col.height / 2, col.z);
      colMesh.castShadow = !blueprint;
      colMesh.receiveShadow = !blueprint;
      colGroup.add(colMesh);

      const edgeLines = new THREE.LineSegments(
        new THREE.EdgesGeometry(colGeo),
        new THREE.LineBasicMaterial({
          color: blueprint ? 0x93c5fd : 0x4a5568,
          transparent: true,
          opacity: blueprint ? 0.8 : 0.45,
        })
      );
      edgeLines.position.copy(colMesh.position);
      colGroup.add(edgeLines);

      // Steel bearing base plate at column top for roof truss seating
      const plateGeo = new THREE.BoxGeometry(colWidth + 0.1, 0.05, colWidth + 0.1);
      const plate = new THREE.Mesh(plateGeo, steelGussetMat);
      plate.position.set(col.x, colTopY + 0.025, col.z);
      plate.castShadow = !blueprint;
      roofGroup.add(plate);

      if (!blueprint) {
        // 4 anchor holding bolts on column head
        for (let i = 0; i < 4; i++) {
          const ox = (i % 2 === 0 ? -1 : 1) * (colWidth / 2 - 0.12);
          const oz = (i < 2 ? -1 : 1) * (colWidth / 2 - 0.12);
          const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.12, 8), rebarMat);
          bolt.position.set(col.x + ox, colTopY + 0.08, col.z + oz);
          roofGroup.add(bolt);
        }
      }
    });

    // 2. Beams (Level 1 and Level 2)
    const levels = [baseY + 3.4, baseY + 6.6];
    levels.forEach((lvlY) => {
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.5, 0.5), beamMat);
      b1.position.set(-4.1, lvlY, 2.4);
      b1.castShadow = !blueprint;
      beamGroup.add(b1);

      const b2 = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.5, 0.5), beamMat);
      b2.position.set(-4.1, lvlY, -2.4);
      b2.castShadow = !blueprint;
      beamGroup.add(b2);

      const b3 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 4.8), beamMat);
      b3.position.set(-6.2, lvlY, 0);
      b3.castShadow = !blueprint;
      beamGroup.add(b3);

      const b4 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 4.8), beamMat);
      b4.position.set(-2.0, lvlY, 0);
      b4.castShadow = !blueprint;
      beamGroup.add(b4);

      const b5 = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.5, 0.5), beamMat);
      b5.position.set(4.3, lvlY, 2.4);
      b5.castShadow = !blueprint;
      beamGroup.add(b5);

      const b6 = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.5, 0.5), beamMat);
      b6.position.set(4.3, lvlY, -2.4);
      b6.castShadow = !blueprint;
      beamGroup.add(b6);

      const b7 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 4.8), beamMat);
      b7.position.set(2.8, lvlY, 0);
      b7.castShadow = !blueprint;
      beamGroup.add(b7);

      const b8 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 4.8), beamMat);
      b8.position.set(5.8, lvlY, 0);
      b8.castShadow = !blueprint;
      beamGroup.add(b8);
    });

    // 3. Slabs (Level 1 and Level 2)
    levels.forEach((lvlY) => {
      const slab1 = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.22, 4.2), slabMat);
      slab1.position.set(-4.1, lvlY - 0.12, 0);
      slab1.castShadow = !blueprint;
      slabGroup.add(slab1);

      const slab2 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.22, 4.2), slabMat);
      slab2.position.set(4.3, lvlY - 0.12, 0);
      slab2.castShadow = !blueprint;
      slabGroup.add(slab2);
    });

    // 4. PRECISION-ENGINEERED PRATT STEEL ROOF TRUSS & PITCHED COMPOSITE DECK
    const tieY = colTopY + 0.12; // 8.27m
    const apexX = -0.2;
    const apexY = colTopY + 2.15; // 10.30m (Apex Ridge)
    const trussSpanLeft = -6.7;
    const trussSpanRight = 6.3;
    const trussHalfSpanL = apexX - trussSpanLeft; // 6.5m
    const trussHalfSpanR = trussSpanRight - apexX; // 6.5m
    const trussHeight = apexY - tieY; // 2.03m
    const pitchAngleL = Math.atan2(trussHeight, trussHalfSpanL); // ~0.302 rad (~17.3 deg)
    const pitchAngleR = Math.atan2(trussHeight, trussHalfSpanR);
    const rafterLenL = Math.sqrt(trussHalfSpanL * trussHalfSpanL + trussHeight * trussHeight); // ~6.81m
    const rafterLenR = Math.sqrt(trussHalfSpanR * trussHalfSpanR + trussHeight * trussHeight);

    // Build Pratt Trusses along Front (z = 2.4) and Back (z = -2.4)
    const trussZPositions = [2.4, -2.4];
    trussZPositions.forEach((tz) => {
      // 4a. Bottom Tie Chord (Horizontal RHS 160x120mm)
      const tieChord = new THREE.Mesh(new THREE.BoxGeometry(trussSpanRight - trussSpanLeft, 0.14, 0.12), steelFramingMat);
      tieChord.position.set((trussSpanLeft + trussSpanRight) / 2, tieY, tz);
      tieChord.castShadow = !blueprint;
      roofGroup.add(tieChord);

      // 4b. Left Sloped Top Chord / Rafter (RHS 180x120mm)
      const rafterLeft = new THREE.Mesh(new THREE.BoxGeometry(rafterLenL, 0.16, 0.12), steelFramingMat);
      rafterLeft.position.set(trussSpanLeft + trussHalfSpanL / 2, tieY + trussHeight / 2, tz);
      rafterLeft.rotation.z = pitchAngleL;
      rafterLeft.castShadow = !blueprint;
      roofGroup.add(rafterLeft);

      // 4c. Right Sloped Top Chord / Rafter
      const rafterRight = new THREE.Mesh(new THREE.BoxGeometry(rafterLenR, 0.16, 0.12), steelFramingMat);
      rafterRight.position.set(apexX + trussHalfSpanR / 2, tieY + trussHeight / 2, tz);
      rafterRight.rotation.z = -pitchAngleR;
      rafterRight.castShadow = !blueprint;
      roofGroup.add(rafterRight);

      // 4d. Central King Post at Apex
      const kingPost = new THREE.Mesh(new THREE.BoxGeometry(0.14, trussHeight, 0.12), steelFramingMat);
      kingPost.position.set(apexX, tieY + trussHeight / 2, tz);
      kingPost.castShadow = !blueprint;
      roofGroup.add(kingPost);

      // 4e. Intermediate Vertical Struts and Diagonal Web Ties
      // Left side nodes: x = -4.9, x = -3.1, x = -1.5
      const leftNodes = [-4.9, -3.1, -1.5];
      leftNodes.forEach((nx, idx) => {
        const frac = (nx - trussSpanLeft) / trussHalfSpanL;
        const vHeight = trussHeight * frac;
        // Vertical strut
        const vMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, vHeight, 0.1), steelFramingMat);
        vMesh.position.set(nx, tieY + vHeight / 2, tz);
        vMesh.castShadow = !blueprint;
        roofGroup.add(vMesh);

        // Diagonal tension tie
        const prevX = idx === 0 ? trussSpanLeft : leftNodes[idx - 1];
        const dx = nx - prevX;
        const dy = vHeight;
        const diagLen = Math.sqrt(dx * dx + dy * dy);
        const diagAngle = Math.atan2(dy, dx);
        const diagMesh = new THREE.Mesh(new THREE.BoxGeometry(diagLen, 0.08, 0.08), steelFramingMat);
        diagMesh.position.set((prevX + nx) / 2, tieY + vHeight / 2, tz);
        diagMesh.rotation.z = diagAngle;
        diagMesh.castShadow = !blueprint;
        roofGroup.add(diagMesh);

        // Node Gusset Plate
        const gusset = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.14), steelGussetMat);
        gusset.position.set(nx, tieY, tz);
        roofGroup.add(gusset);
      });

      // Right side nodes: x = +1.3, x = +2.9, x = +4.7
      const rightNodes = [1.3, 2.9, 4.7];
      rightNodes.forEach((nx, idx) => {
        const frac = (trussSpanRight - nx) / trussHalfSpanR;
        const vHeight = trussHeight * frac;
        // Vertical strut
        const vMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, vHeight, 0.1), steelFramingMat);
        vMesh.position.set(nx, tieY + vHeight / 2, tz);
        vMesh.castShadow = !blueprint;
        roofGroup.add(vMesh);

        // Diagonal tension tie
        const nextX = idx === rightNodes.length - 1 ? trussSpanRight : rightNodes[idx + 1];
        const dx = nextX - nx;
        const dy = vHeight;
        const diagLen = Math.sqrt(dx * dx + dy * dy);
        const diagAngle = Math.atan2(dy, -dx);
        const diagMesh = new THREE.Mesh(new THREE.BoxGeometry(diagLen, 0.08, 0.08), steelFramingMat);
        diagMesh.position.set((nx + nextX) / 2, tieY + vHeight / 2, tz);
        diagMesh.rotation.z = diagAngle;
        diagMesh.castShadow = !blueprint;
        roofGroup.add(diagMesh);

        // Node Gusset Plate
        const gusset = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.14), steelGussetMat);
        gusset.position.set(nx, tieY, tz);
        roofGroup.add(gusset);
      });
    });

    // 4f. Transverse Tie Beams connecting Front and Back Trusses along Z
    [-6.2, -4.9, -3.1, -1.5, apexX, 1.3, 2.9, 4.7, 5.8].forEach((tx) => {
      const transTie = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 4.8), steelFramingMat);
      transTie.position.set(tx, tieY, 0);
      transTie.castShadow = !blueprint;
      roofGroup.add(transTie);
    });

    // 4g. Longitudinal Apex Ridge Beam (HEB 220)
    const ridgeBeam = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 5.4), steelFramingMat);
    ridgeBeam.position.set(apexX, apexY, 0);
    ridgeBeam.castShadow = !blueprint;
    roofGroup.add(ridgeBeam);

    // 4h. Longitudinal Steel Purlins (Z-Purlins spaced ~1.2m across sloped rafters)
    const purlinXOffsets = [-5.5, -4.2, -2.9, -1.6, 1.2, 2.5, 3.8, 5.1];
    purlinXOffsets.forEach((px) => {
      const isLeft = px < apexX;
      const frac = isLeft ? (px - trussSpanLeft) / trussHalfSpanL : (trussSpanRight - px) / trussHalfSpanR;
      const py = tieY + trussHeight * frac + 0.12;
      const purlinMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 5.4), steelFramingMat);
      purlinMesh.position.set(px, py, 0);
      purlinMesh.rotation.z = isLeft ? pitchAngleL : -pitchAngleR;
      purlinMesh.castShadow = !blueprint;
      roofGroup.add(purlinMesh);
    });

    // 4i. Pitched Architectural Standing-Seam Composite Roof Panels
    // Left Sloped Panel (Solid with standing seam texture)
    const roofPanelL = new THREE.Mesh(new THREE.BoxGeometry(rafterLenL + 0.3, 0.08, 5.6), roofPanelMat);
    roofPanelL.position.set(trussSpanLeft + trussHalfSpanL / 2, tieY + trussHeight / 2 + 0.12, 0);
    roofPanelL.rotation.z = pitchAngleL;
    roofPanelL.castShadow = !blueprint;
    roofGroup.add(roofPanelL);

    // Right Sloped Panel (Subtle architectural translucent reveal showcasing internal steel truss engineering)
    const roofPanelR = new THREE.Mesh(new THREE.BoxGeometry(rafterLenR + 0.3, 0.08, 5.6), roofTranslucentMat);
    roofPanelR.position.set(apexX + trussHalfSpanR / 2, tieY + trussHeight / 2 + 0.12, 0);
    roofPanelR.rotation.z = -pitchAngleR;
    roofPanelR.castShadow = !blueprint;
    roofGroup.add(roofPanelR);

    // 4j. Apex Ridge Cap Flashing
    const ridgeCap = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 5.62), steelGussetMat);
    ridgeCap.position.set(apexX, apexY + 0.16, 0);
    ridgeCap.castShadow = !blueprint;
    roofGroup.add(ridgeCap);

    // 4k. Eaves Fascia & Gutter along perimeter
    const gutterL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 5.6), steelGussetMat);
    gutterL.position.set(trussSpanLeft - 0.1, tieY, 0);
    roofGroup.add(gutterL);

    const gutterR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 5.6), steelGussetMat);
    gutterR.position.set(trussSpanRight + 0.1, tieY, 0);
    roofGroup.add(gutterR);

    // 5. Load Path Vectors
    glowMat = new THREE.MeshBasicMaterial({
      color: 0xffa000,
      transparent: true,
      opacity: 0.85,
    });

    const arrowConeGeo = new THREE.ConeGeometry(0.3, 0.6, 16);
    arrowConeGeo.rotateX(Math.PI);
    const arrowStemGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.0, 10);

    COLUMN_LOCATIONS.forEach((col) => {
      const arr = new THREE.Group();
      const stem = new THREE.Mesh(arrowStemGeo, glowMat);
      stem.position.set(0, 0.5, 0);
      arr.add(stem);
      const cone = new THREE.Mesh(arrowConeGeo, glowMat);
      cone.position.set(0, 0, 0);
      arr.add(cone);
      arr.position.set(col.x, baseY + col.height + 0.8, col.z);
      loadPathGroup.add(arr);
      columnArrows.push(arr);
    });

    for (let rx = -7.0; rx <= 0.2; rx += 1.8) {
      for (let rz = -3.6; rz <= 3.0; rz += 1.8) {
        const arr = new THREE.Group();
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), glowMat);
        stem.position.set(0, 0.25, 0);
        arr.add(stem);
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.32, 10), glowMat);
        cone.rotateX(Math.PI);
        cone.position.set(0, 0, 0);
        arr.add(cone);
        arr.position.set(rx, -0.6, rz);
        loadPathGroup.add(arr);
        raftPressureArrows.push(arr);
      }
    }

    PILE_LOCATIONS.forEach((pile) => {
      const tipY = -pile.length;
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const arr = new THREE.Group();
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.45, 6), glowMat);
        stem.position.set(0, 0.22, 0);
        arr.add(stem);
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.28, 8), glowMat);
        cone.rotateX(Math.PI);
        cone.position.set(0, 0, 0);
        arr.add(cone);
        arr.rotation.y = angle;
        arr.rotation.z = 0.58;
        arr.position.set(pile.x, tipY, pile.z);
        loadPathGroup.add(arr);
        endBearingArrows.push(arr);
      }
    });
  };

  buildSuperstructure(isBlueprint);

  rootGroup.add(soilGroup);
  rootGroup.add(pileGroup);
  rootGroup.add(raftGroup);
  rootGroup.add(colGroup);
  rootGroup.add(beamGroup);
  rootGroup.add(slabGroup);
  rootGroup.add(roofGroup);
  rootGroup.add(loadPathGroup);
  rootGroup.add(blueprintGrid);

  // Strictly controlled stage-specific visible geometry
  const applyLayerFocus = (layer: StructuralLayerId) => {
    activeLayer = layer;

    if (layer === "foundation") {
      // ONLY Foundation: ground, soil layers, bearing rock, bored piles, raft slab & starter dowels
      soilGroup.visible = true;
      pileGroup.visible = true;
      raftGroup.visible = true;
      colGroup.visible = false;
      beamGroup.visible = false;
      slabGroup.visible = false;
      roofGroup.visible = false;
    } else if (layer === "columns") {
      // Foundation + Columns
      soilGroup.visible = true;
      pileGroup.visible = true;
      raftGroup.visible = true;
      colGroup.visible = true;
      beamGroup.visible = false;
      slabGroup.visible = false;
      roofGroup.visible = false;
    } else if (layer === "beams") {
      // Foundation + Columns + Beams
      soilGroup.visible = true;
      pileGroup.visible = true;
      raftGroup.visible = true;
      colGroup.visible = true;
      beamGroup.visible = true;
      slabGroup.visible = false;
      roofGroup.visible = false;
    } else if (layer === "slabs") {
      // Foundation + Columns + Beams + Slabs
      soilGroup.visible = true;
      pileGroup.visible = true;
      raftGroup.visible = true;
      colGroup.visible = true;
      beamGroup.visible = true;
      slabGroup.visible = true;
      roofGroup.visible = false;
    } else if (layer === "roof") {
      // Foundation + Columns + Beams + Slabs + Roof
      soilGroup.visible = true;
      pileGroup.visible = true;
      raftGroup.visible = true;
      colGroup.visible = true;
      beamGroup.visible = true;
      slabGroup.visible = true;
      roofGroup.visible = true;
    } else if (layer === "complete") {
      // Fully assembled complete structural frame
      soilGroup.visible = true;
      pileGroup.visible = true;
      raftGroup.visible = true;
      colGroup.visible = true;
      beamGroup.visible = true;
      slabGroup.visible = true;
      roofGroup.visible = true;
    }
    loadPathGroup.visible = showLoadPath;
  };

  applyLayerFocus(activeLayer);

  // Compute bounding box of ONLY visible children for dynamic camera framing
  const getVisibleBounds = (): THREE.Box3 => {
    const box = new THREE.Box3();
    const tempBox = new THREE.Box3();

    rootGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && child.visible) {
        let p: THREE.Object3D | null = child.parent;
        let isVisibleInHierarchy = true;
        while (p && p !== rootGroup) {
          if (!p.visible) {
            isVisibleInHierarchy = false;
            break;
          }
          p = p.parent;
        }
        if (isVisibleInHierarchy) {
          tempBox.setFromObject(child);
          box.union(tempBox);
        }
      }
    });

    if (box.isEmpty()) {
      box.set(new THREE.Vector3(-9, -14, -7), new THREE.Vector3(9, 10, 7));
    }

    return box;
  };

  const rebuild = () => {
    rootGroup.remove(soilGroup, pileGroup, raftGroup, blueprintGrid);

    soilGroup = createSoilLayers(textures, isBlueprint);
    pileGroup = createPileFoundation(textures, isBlueprint);
    raftGroup = createRaftFoundation(textures, isBlueprint);
    blueprintGrid = createBlueprintGrid();

    buildSuperstructure(isBlueprint);

    rootGroup.add(soilGroup, pileGroup, raftGroup, blueprintGrid);
    applyLayerFocus(activeLayer);
  };

  const update = (time: number, _delta: number) => {
    if (loadPathGroup.visible && glowMat) {
      const pulse = 0.75 + 0.25 * Math.sin(time * 2.8);
      glowMat.opacity = pulse;

      columnArrows.forEach((arr, i) => {
        arr.position.y = 1.35 + 6.8 + 0.8 + 0.12 * Math.sin(time * 3.5 + i * 0.4);
      });

      raftPressureArrows.forEach((arr, i) => {
        arr.position.y = -0.6 + 0.06 * Math.sin(time * 2.8 + i * 0.25);
      });

      endBearingArrows.forEach((arr, i) => {
        const s = 0.92 + 0.16 * Math.sin(time * 3.5 + i * 0.35);
        arr.scale.set(s, s, s);
      });
    }
  };

  const setBlueprintMode = (blueprint: boolean) => {
    if (isBlueprint !== blueprint) {
      isBlueprint = blueprint;
      rebuild();
    }
  };

  const setShowLoadPath = (show: boolean) => {
    showLoadPath = show;
    loadPathGroup.visible = show;
  };

  const setActiveLayer = (layer: StructuralLayerId) => {
    applyLayerFocus(layer);
  };

  const dispose = () => {
    Object.values(textures).forEach((tex) => tex.dispose());
  };

  return {
    group: rootGroup,
    update,
    setBlueprintMode,
    setShowLoadPath,
    setActiveLayer,
    getVisibleBounds,
    dispose,
  };
}
