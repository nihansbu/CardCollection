import { chromium } from "playwright-core";

const baseUrl = process.env.RAP_APP_URL ?? "http://127.0.0.1:4173";
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  args: ["--disable-gpu"],
});

const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const messages = [];

page.on("console", (message) => {
  messages.push(`${message.type()}: ${message.text()}`);
});

page.on("pageerror", (error) => {
  messages.push(`pageerror: ${error.message}`);
});

let ok = false;
let bodyText = "";
let rootHtmlLength = 0;
let failure = null;

try {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  rootHtmlLength = await page.locator("#root").evaluate((element) => element.innerHTML.length);
  bodyText = await page.locator("body").innerText();

  await page.getByRole("button", { name: /Karten anzeigen/ }).first().click({ timeout: 5000 });
  await page.getByText("Master Chief").waitFor({ timeout: 5000 });
  await page.getByRole("button", { name: "Kartenliste schliessen" }).click({ timeout: 5000 });
  await page.getByRole("button", { name: "Test-RAP hinzufuegen" }).click({ timeout: 5000 });
  await page.getByRole("button", { name: /kaufen/i }).first().click({ timeout: 5000 });
  await page.getByText("Pack geoeffnet.").waitFor({ timeout: 5000 });
  await page.getByRole("button", { name: "Weiter" }).click({ timeout: 5000 });
  ok = true;
} catch (error) {
  failure = error.message;
} finally {
  await page.screenshot({
    path: "C:\\Users\\nikla\\Documents\\CardCollection\\shop-screenshot.png",
    fullPage: true,
  });

  await browser.close();
}

console.log(JSON.stringify({
  ok,
  url: baseUrl,
  rootHtmlLength,
  bodyPreview: bodyText.slice(0, 600),
  containsShopNav: bodyText.includes("SHOP") && bodyText.includes("SAMMLUNG"),
  containsCollectionProgress: /Total Cards\s+\d+\/24/.test(bodyText),
  containsMythicOdds: bodyText.includes("Mythic") && bodyText.includes("0.33%"),
  messages,
  failure,
}, null, 2));

if (!ok) {
  process.exitCode = 1;
}
