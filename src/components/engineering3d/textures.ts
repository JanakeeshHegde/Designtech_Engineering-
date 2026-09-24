import * as THREE from "three";

// High-resolution procedural texture generator for photorealistic engineering BIM materials
export function createLayerTextures() {
  const createProceduralTexture = (
    type: "soil" | "sand" | "clay" | "weathered" | "bedrock" | "concrete" | "concrete_rough"
  ) => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    if (type === "soil") {
      // Dark rich organic loam topsoil
      ctx.fillStyle = "#332217";
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 2400; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = 1 + Math.random() * 2.5;
        ctx.fillStyle = Math.random() > 0.4 ? "#24160e" : "#463022";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === "sand") {
      // Golden compacted sand / granular aggregate layer
      ctx.fillStyle = "#cb9f5e";
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 3500; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillStyle = Math.random() > 0.5 ? "#e6bc7e" : "#b08544";
        ctx.fillRect(x, y, 1.5 + Math.random() * 2, 1.5 + Math.random() * 2);
      }
      // Horizontal compaction layer lines
      for (let y = 30; y < 512; y += 45) {
        ctx.strokeStyle = "rgba(160, 115, 50, 0.25)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, y + (Math.random() - 0.5) * 6);
        ctx.lineTo(512, y + (Math.random() - 0.5) * 6);
        ctx.stroke();
      }
    } else if (type === "clay") {
      // Dense reddish brown silty clay
      ctx.fillStyle = "#8a4724";
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 1800; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillStyle = Math.random() > 0.5 ? "#703517" : "#a15931";
        ctx.fillRect(x, y, 3 + Math.random() * 4, 2 + Math.random() * 2);
      }
    } else if (type === "weathered") {
      // Fractured weathered rock layer (grey-brown stone fissures)
      ctx.fillStyle = "#5c5044";
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 2200; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillStyle = Math.random() > 0.5 ? "#43392f" : "#756759";
        ctx.fillRect(x, y, 4 + Math.random() * 6, 3 + Math.random() * 4);
      }
      // Structural fissure lines
      ctx.strokeStyle = "rgba(40, 32, 25, 0.45)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 16; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 512, Math.random() * 512);
        ctx.lineTo(Math.random() * 512, Math.random() * 512);
        ctx.stroke();
      }
    } else if (type === "bedrock") {
      // Hard deep bearing rock stratum (crystalline basalt/granite)
      ctx.fillStyle = "#1e2229";
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 3000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillStyle = Math.random() > 0.5 ? "#14171d" : "#2d333e";
        ctx.fillRect(x, y, 3 + Math.random() * 5, 2 + Math.random() * 4);
      }
      // Crystalline fractured jointing
      ctx.strokeStyle = "rgba(10, 12, 16, 0.6)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 25; i++) {
        ctx.beginPath();
        const sx = Math.random() * 512;
        const sy = Math.random() * 512;
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + (Math.random() - 0.5) * 120, sy + (Math.random() - 0.5) * 120);
        ctx.stroke();
      }
    } else if (type === "concrete") {
      // Architectural reinforced concrete with formwork tie holes & subtle aggregate
      ctx.fillStyle = "#dedad2";
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 2800; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillStyle = Math.random() > 0.5 ? "#cbc6bc" : "#ece9e2";
        ctx.fillRect(x, y, 1.5, 1.5);
      }
      // Formwork panel joints
      ctx.strokeStyle = "rgba(160, 154, 144, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(4, 4, 504, 504);
      ctx.beginPath();
      ctx.moveTo(256, 0); ctx.lineTo(256, 512);
      ctx.moveTo(0, 256); ctx.lineTo(512, 256);
      ctx.stroke();

      // Formwork tie-rod circles
      const tiePoints = [
        [64, 64], [448, 64], [64, 448], [448, 448],
        [192, 192], [320, 192], [192, 320], [320, 320]
      ];
      tiePoints.forEach(([tx, ty]) => {
        ctx.fillStyle = "rgba(100, 94, 85, 0.4)";
        ctx.beginPath();
        ctx.arc(tx, ty, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(70, 65, 58, 0.5)";
        ctx.stroke();
      });
    } else if (type === "concrete_rough") {
      // Cast-in-situ rough pile shaft concrete
      ctx.fillStyle = "#cfcbc2";
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 3500; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillStyle = Math.random() > 0.5 ? "#b8b3a8" : "#e2ded6";
        ctx.fillRect(x, y, 2 + Math.random() * 3, 2 + Math.random() * 2);
      }
    } else if (type === "steel_roof") {
      // Standing seam dark architectural zinc/steel roof panel texture
      ctx.fillStyle = "#2d3748";
      ctx.fillRect(0, 0, 512, 512);
      // Subtle brushed metal streaks
      for (let i = 0; i < 1500; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillStyle = Math.random() > 0.5 ? "#374151" : "#1f2937";
        ctx.fillRect(x, y, 1.5, 4 + Math.random() * 6);
      }
      // Standing seam ribs
      for (let x = 0; x < 512; x += 64) {
        ctx.fillStyle = "#111827";
        ctx.fillRect(x - 2, 0, 4, 512);
        ctx.fillStyle = "#4b5563";
        ctx.fillRect(x + 2, 0, 2, 512);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    return texture;
  };

  return {
    soil: createProceduralTexture("soil"),
    sand: createProceduralTexture("sand"),
    clay: createProceduralTexture("clay"),
    weathered: createProceduralTexture("weathered"),
    bedrock: createProceduralTexture("bedrock"),
    concrete: createProceduralTexture("concrete"),
    concrete_rough: createProceduralTexture("concrete_rough"),
    steel_roof: createProceduralTexture("steel_roof" as any),
  };
}
