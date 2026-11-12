import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { chromium } from "playwright";

const port = process.env.RESPONSIVE_PORT || "4173";
const externalBaseURL = process.env.RESPONSIVE_BASE_URL;
const baseURL = externalBaseURL || `http://127.0.0.1:${port}`;
const server = externalBaseURL
  ? null
  : spawn(
      process.execPath,
      [resolve("node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", port],
      { env: { ...process.env, PORT: port }, stdio: "inherit", windowsHide: true },
    );
const routes = [
  "/",
  "/services",
  "/services/web-design",
  "/services/ai-automation",
  "/services/ai-agents",
  "/services/workflow-automation",
  "/patient-growth",
  "/industries",
  "/industries/dental-practices",
  "/industries/physiotherapy",
  "/industries/private-healthcare",
  "/growth-assessment",
  "/resources",
  "/work",
  "/about",
  "/blog",
  "/contact",
  "/admin/login",
];
const widths = [320, 360, 390, 480, 640, 768, 1024, 1280, 1600];
const startupDeadline = Date.now() + 120000;
let serverReady = false;
while (Date.now() < startupDeadline && (!server || server.exitCode === null)) {
  try {
    const response = await fetch(baseURL);
    if (response.ok) {
      serverReady = true;
      break;
    }
  } catch {}
  await new Promise((resolve) => setTimeout(resolve, 500));
}
if (!serverReady) {
  server?.kill();
  throw new Error(`Next.js server did not become ready at ${baseURL}`);
}

let browser;
let failures = 0;

try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  page.setDefaultTimeout(10000);

  for (const route of routes) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(new URL(route, baseURL).toString(), {
        waitUntil: "domcontentloaded",
      });
      assert.ok(response && response.status() < 400, `${route} returned HTTP ${response?.status()}`);
      await page.locator("body").waitFor();
      await page.evaluate(() => document.fonts.ready.then(() => true));

      const dimensions = await page.evaluate(() => {
        const selectors = "main a, main button, main input, main select, main textarea, main img, main h1, main h2, main p, main table";
        const overflowingElements = Array.from(document.querySelectorAll(selectors))
          .map((element) => {
            const rect = element.getBoundingClientRect();
            let parent = element.parentElement;
            let insideHorizontalScroller = false;
            while (parent) {
              const overflowX = getComputedStyle(parent).overflowX;
              if (overflowX === "auto" || overflowX === "scroll") {
                insideHorizontalScroller = true;
                break;
              }
              parent = parent.parentElement;
            }
            return {
              tag: element.tagName,
              text: (element.textContent || "").trim().slice(0, 48),
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              insideHorizontalScroller,
            };
          })
          .filter((item) => item.width > 0 && !item.insideHorizontalScroller &&
            (item.left < -2 || item.right > window.innerWidth + 2))
          .slice(0, 5);
        return {
          viewport: window.innerWidth,
          document: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
          overflowingElements,
        };
      });
      const overflow = Math.max(dimensions.document, dimensions.body) - dimensions.viewport;
      if (overflow > 1 || dimensions.overflowingElements.length > 0) {
        failures += 1;
        console.error(`OVERFLOW ${route} @ ${width}px: ${JSON.stringify(dimensions)}`);
      }
    }
    console.log(`Checked ${route} at ${widths.length} viewport widths`);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(new URL("/", baseURL).toString(), { waitUntil: "domcontentloaded" });
  const openMenu = page.getByRole("button", { name: "Open menu" });
  await openMenu.click();
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await dialog.waitFor({ state: "visible" });
  await assert.doesNotReject(() => dialog.getByRole("link", { name: "Services" }).waitFor());
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "detached" });
  assert.equal(await openMenu.evaluate((element) => element === document.activeElement), true,
    "Closing the mobile menu should restore focus to its trigger");

  await openMenu.click();
  await dialog.getByRole("link", { name: "Services" }).click();
  await page.waitForURL("**/services");
  await dialog.waitFor({ state: "detached" });
  console.log("Mobile navigation open, Escape close, focus restoration and route navigation passed");

  assert.equal(failures, 0, `${failures} responsive viewport overflow checks failed`);
  console.log(`Responsive smoke test passed: ${routes.length} routes × ${widths.length} viewport widths`);
} finally {
  if (browser) await browser.close();
  server?.kill();
}
