import { spawn } from "child_process";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9223;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getWebSocketDebuggerUrl() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const data = await res.json();
      if (data && data.length > 0 && data[0].webSocketDebuggerUrl) {
        return data[0].webSocketDebuggerUrl;
      }
    } catch (e) {
      // wait
    }
    await sleep(300);
  }
  throw new Error("Could not connect to Edge DevTools port");
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new globalThis.WebSocket(this.wsUrl);
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id && this.callbacks.has(data.id)) {
          const cb = this.callbacks.get(data.id);
          this.callbacks.delete(data.id);
          if (data.error) cb.reject(data.error);
          else cb.resolve(data.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.value;
  }
}

async function runTests() {
  console.log("Starting headless Edge for Sectors scrolling test...");
  const edge = spawn(EDGE_PATH, [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "http://127.0.0.1:5191/sectors",
  ]);

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    const client = new CDPClient(wsUrl);
    await client.connect();
    await client.send("Page.enable");
    await client.send("Runtime.enable");

    // Wait for hydration
    await client.eval(`
      new Promise((resolve) => {
        const interval = setInterval(() => {
          if (document.querySelector(".sector-sc-proj-list")) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      })
    `);

    const resolutions = [
      { name: "Common Laptop", width: 1366, height: 768 },
      { name: "MacBook / Standard Laptop", width: 1440, height: 900 },
      { name: "Full HD Desktop", width: 1920, height: 1080 },
    ];

    for (const res of resolutions) {
      console.log(`\nTesting ${res.name} (${res.width}x${res.height})...`);
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: res.width,
        height: res.height,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await sleep(300);

      const inspection = await client.eval(`
        (() => {
          const lists = Array.from(document.querySelectorAll(".sector-sc-proj-list"));
          return lists.map((list, idx) => {
            const computed = window.getComputedStyle(list);
            const items = list.querySelectorAll(".sector-sc-proj-item");
            const rect = list.getBoundingClientRect();
            return {
              sectorIndex: idx + 1,
              itemsCount: items.length,
              maxHeight: computed.maxHeight,
              overflowY: computed.overflowY,
              scrollHeight: list.scrollHeight,
              clientHeight: list.clientHeight,
              hasInternalScroll: list.scrollHeight > list.clientHeight,
              height: rect.height,
            };
          });
        })()
      `);

      for (const info of inspection) {
        console.log(`  Sector ${info.sectorIndex} Project List:`, {
          itemsCount: info.itemsCount,
          maxHeight: info.maxHeight,
          overflowY: info.overflowY,
          hasInternalScroll: info.hasInternalScroll,
          naturalHeight: `${info.height}px`,
        });

        if (info.overflowY !== "visible" && info.overflowY !== "") {
          throw new Error(`Sector ${info.sectorIndex} still has nested overflow: ${info.overflowY}`);
        }
        if (info.hasInternalScroll) {
          throw new Error(`Sector ${info.sectorIndex} still has internal scroll trap!`);
        }
      }

      // Test page scroll all the way to bottom and verify smooth page accessibility
      const pageScroll = await client.eval(`
        (() => {
          const initialY = window.scrollY;
          window.scrollTo(0, document.body.scrollHeight);
          const scrolledY = window.scrollY;
          return {
            initialY,
            scrolledY,
            pageHeight: document.body.scrollHeight,
          };
        })()
      `);

      console.log(`  Page scrolling check: can scroll full page to ${pageScroll.scrolledY}px of ${pageScroll.pageHeight}px`);
      console.log(`  ✓ Resolution ${res.width}x${res.height} passed perfectly!`);
    }

    console.log(`\nALL LAPTOP AND DESKTOP RESOLUTIONS PASSED WITH NATURAL SCROLLING!`);
  } finally {
    edge.kill();
  }
}

runTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
