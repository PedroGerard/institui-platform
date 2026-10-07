const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const baseUrl = process.env.AUDIT_BASE_URL ?? "http://127.0.0.1:3011";
const outputDir = "C:/Users/user/Documents/INSTITUI+/materiais/auditoria-visual-site-2026-07-06";
const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const remotePort = 9231;

const pages = [
  ["/", "home-mobile-cdp.png", "mobile"],
  ["/areas-de-atuacao", "areas-mobile-cdp.png", "mobile"],
  ["/transparencia/emendas-parlamentares", "emendas-mobile-cdp.png", "mobile"],
  ["/contato", "contato-mobile-cdp.png", "mobile"],
  ["/", "home-desktop-cdp.png", "desktop"],
  ["/projetos", "projetos-desktop-cdp.png", "desktop"],
];

const viewports = {
  mobile: {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  },
  desktop: {
    width: 1440,
    height: 1100,
    deviceScaleFactor: 1,
    mobile: false,
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDevTools() {
  const endpoint = `http://127.0.0.1:${remotePort}/json/version`;

  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        return response.json();
      }
    } catch {
      // Chrome is still starting.
    }

    await delay(200);
  }

  throw new Error("Chrome DevTools endpoint did not become ready.");
}

function createCdpClient(wsUrl) {
  const socket = new WebSocket(wsUrl);
  let nextId = 1;
  const pending = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);

      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolve(message.result);
      }
    }
  });

  const ready = new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  return {
    ready,
    send(method, params = {}, sessionId) {
      const id = nextId;
      nextId += 1;

      const payload = { id, method, params };
      if (sessionId) {
        payload.sessionId = sessionId;
      }

      const promise = new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
      });

      socket.send(JSON.stringify(payload));
      return promise;
    },
    close() {
      socket.close();
    },
  };
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${remotePort}`,
    `--user-data-dir=${path.join(os.tmpdir(), "codex-chrome-cdp-audit-2026-07-06")}`,
    "about:blank",
  ], {
    stdio: "ignore",
  });

  const version = await waitForDevTools();
  const cdp = createCdpClient(version.webSocketDebuggerUrl);
  await cdp.ready;

  const results = [];

  for (const [route, fileName, mode] of pages) {
    const viewport = viewports[mode];
    const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });

    await cdp.send("Page.enable", {}, sessionId);
    await cdp.send("Runtime.enable", {}, sessionId);
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: viewport.deviceScaleFactor,
      mobile: viewport.mobile,
    }, sessionId);
    await cdp.send("Emulation.setTouchEmulationEnabled", {
      enabled: viewport.mobile,
    }, sessionId);

    await cdp.send("Page.navigate", { url: `${baseUrl}${route}` }, sessionId);
    await delay(1500);
    await cdp.send("Runtime.evaluate", {
      expression: "window.localStorage.setItem('incentive_cookie_consent', 'rejected')",
    }, sessionId);
    await cdp.send("Page.reload", {}, sessionId);
    await delay(2000);

    const screenshot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
    }, sessionId);
    fs.writeFileSync(path.join(outputDir, fileName), Buffer.from(screenshot.data, "base64"));

    const metrics = await cdp.send("Runtime.evaluate", {
      returnByValue: true,
      expression: `JSON.stringify({
        route: window.location.pathname,
        mode: "${mode}",
        viewport: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyTextLength: document.body.innerText.trim().length,
        hasNextOverlay: Boolean(document.querySelector("[data-nextjs-dialog]")),
        hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      })`,
    }, sessionId);

    results.push({ fileName, ...JSON.parse(metrics.result.value) });
    await cdp.send("Target.closeTarget", { targetId });
  }

  cdp.close();
  chrome.kill();

  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
