import * as THREE from "three";
import { createLayerTextures } from "./textures";
import { createSoilLayers } from "./SoilLayers";
import { createPileFoundation } from "./PileFoundation";
import { createRaftFoundation } from "./RaftFoundation";
import { createStructuralColumns } from "./StructuralColumns";
import { createLoadPath } from "./LoadPath";
import { createBlueprintGrid } from "./BlueprintGrid";

export interface FoundationModelOptions {
  isBlueprint?: boolean;
  constructionPhase?: number; // 1 to 9
  showLoadPath?: boolean;
}

export interface FoundationModelInstance {
  group: THREE.Group;
  update: (time: number, delta: number) => void;
  setConstructionPhase: (phase: number) => void;
  setBlueprintMode: (isBlueprint: boolean) => void;
  setShowLoadPath: (show: boolean) => void;
  dispose: () => void;
}

export function createFoundationModel(options: FoundationModelOptions = {}): FoundationModelInstance {
  const rootGroup = new THREE.Group();
  rootGroup.name = "foundation-engineering-model";

  const textures = createLayerTextures();

  let isBlueprint = !!options.isBlueprint;
  let currentPhase = options.constructionPhase ?? 9;
  let showLoadPath = options.showLoadPath ?? true;

  let soilGroup = createSoilLayers(textures, isBlueprint);
  let pileGroup = createPileFoundation(textures, isBlueprint);
  let raftGroup = createRaftFoundation(textures, isBlueprint);
  let colGroup = createStructuralColumns(textures, isBlueprint);
  let { group: loadPathGroup, update: updateLoadPath } = createLoadPath();
  let blueprintGrid = createBlueprintGrid();

  rootGroup.add(soilGroup);
  rootGroup.add(pileGroup);
  rootGroup.add(raftGroup);
  rootGroup.add(colGroup);
  rootGroup.add(loadPathGroup);
  rootGroup.add(blueprintGrid);

  // Center model vertically so rotation pivot is at the true geometric centroid
  rootGroup.position.set(0, 0, 0);

  // Apply construction phase visibility
  const applyPhaseVisibility = (phase: number) => {
    currentPhase = phase;
    // Phase 1: Soil layers only
    soilGroup.visible = phase >= 1;
    // Phase 2: Bearing bedrock visible (in soilGroup)
    // Phase 3: Pile boring positions
    // Phase 4: Piles extending down
    pileGroup.visible = phase >= 4;
    // Phase 5: Pile caps
    // Phase 6: Raft foundation forms
    raftGroup.visible = phase >= 6;
    // Phase 7: Columns rise
    colGroup.visible = phase >= 7;
    // Phase 8: Load path becomes visible
    loadPathGroup.visible = phase >= 8 && showLoadPath;
    // Phase 9: Complete assembly
  };

  applyPhaseVisibility(currentPhase);

  const rebuild = () => {
    rootGroup.remove(soilGroup, pileGroup, raftGroup, colGroup, loadPathGroup, blueprintGrid);

    soilGroup = createSoilLayers(textures, isBlueprint);
    pileGroup = createPileFoundation(textures, isBlueprint);
    raftGroup = createRaftFoundation(textures, isBlueprint);
    colGroup = createStructuralColumns(textures, isBlueprint);
    const lp = createLoadPath();
    loadPathGroup = lp.group;
    updateLoadPath = lp.update;
    blueprintGrid = createBlueprintGrid();

    rootGroup.add(soilGroup, pileGroup, raftGroup, colGroup, loadPathGroup, blueprintGrid);
    applyPhaseVisibility(currentPhase);
  };

  const update = (time: number, _delta: number) => {
    if (loadPathGroup.visible) {
      updateLoadPath(time);
    }
  };

  const setConstructionPhase = (phase: number) => {
    applyPhaseVisibility(phase);
  };

  const setBlueprintMode = (blueprint: boolean) => {
    if (isBlueprint !== blueprint) {
      isBlueprint = blueprint;
      rebuild();
    }
  };

  const setShowLoadPath = (show: boolean) => {
    showLoadPath = show;
    loadPathGroup.visible = show && currentPhase >= 8;
  };

  const dispose = () => {
    Object.values(textures).forEach((tex) => tex.dispose());
  };

  return {
    group: rootGroup,
    update,
    setConstructionPhase,
    setBlueprintMode,
    setShowLoadPath,
    dispose,
  };
}
