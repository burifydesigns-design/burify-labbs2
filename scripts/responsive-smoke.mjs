import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseURL = process.env.RESPONSIVE_BASE_URL || "http://127.0.0.1:3000";
const routes = [
  "/",
  "/services",
  "/services/web-design",
  "/services/ai-automation",
  "/services/ai-agents",
  "/services/workflow-automation",
  "/work",
  "/about",
  "/blog",
  "/contact",
  "/admin/login",
];
const widths = [320, 360, 390, 480, 640, 768, 1024, 1280, 1600];
const browser = await chromium.launch({ headless: true });
let failures = 0;

try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  page.setDefaultTimeout(10000);

  for (const route of routes) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(new URL(route, baseURL).toString(), {
        waitUntil: "domcontentloaded",
      });
      assert.ok(response && response.status() < 500, `${route} returned HTTP ${response?.status()}`);
      await page.locator("body").waitFor();
      await page.evaluate(() => document.fonts.ready);

      const dimensions = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }));
      const overflow = Math.max(dimensions.document, dimensions.body) - dimensions.viewport;
      if (overflow > 1) {
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
  await browser.close();
}
