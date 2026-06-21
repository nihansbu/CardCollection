import { chromium } from "playwright-core";

const baseUrl = process.env.RAP_APP_URL ?? "http://127.0.0.1:5173/CardCollection/";
const browser = await chromium.launch({
  args: ["--disable-gpu"],
  channel: "msedge",
  headless: true,
});

const page = await browser.newPage({ isMobile: true, viewport: { width: 393, height: 852 } });
const messages = [];

page.on("console", (message) => {
  if (message.type() === "error") {
    messages.push(`${message.type()}: ${message.text()}`);
  }
});

page.on("pageerror", (error) => {
  messages.push(`pageerror: ${error.message}`);
});

let ok = false;
let failure = null;
let result = {};

try {
  await page.addInitScript(() => {
    localStorage.setItem("codex-collector-v1-rap", "10000");
    localStorage.removeItem("codex-collector-v1-skills");
    localStorage.setItem("codex-collector-v1-skill-training-slots", JSON.stringify(["Woodcutting", null, null]));
    localStorage.setItem("codex-collector-v1-skill-training-last-tick", String(Date.now() - 60000));
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.locator('.bottom-nav-item[aria-label="Skills"]').click();
  await page.getByRole("heading", { name: /^Skills$/i }).waitFor({ timeout: 5000 });

  const trainingCards = await page.locator(".skill-card.is-training-skill").count();
  const woodcuttingClass = await page.getByRole("button", { name: /Woodcutting/i }).getAttribute("class");
  const attackClass = await page.getByRole("button", { name: /Attack/i }).getAttribute("class");
  const storedRap = Number(await page.evaluate(() => localStorage.getItem("codex-collector-v1-rap")));
  const storedSkills = JSON.parse(await page.evaluate(() => localStorage.getItem("codex-collector-v1-skills")));
  const woodcutting = storedSkills.find((skill) => skill.name === "Woodcutting");
  const overflow = await page.evaluate(() => ({
    bodyScrollHeight: document.body.scrollHeight,
    bodyScrollWidth: document.body.scrollWidth,
    clientHeight: document.documentElement.clientHeight,
    clientWidth: document.documentElement.clientWidth,
  }));

  result = {
    attackClass,
    overflow,
    storedRap,
    trainingCards,
    woodcuttingClass,
    woodcuttingLevel: woodcutting?.level,
    woodcuttingXp: woodcutting?.currentXp,
  };

  ok = (
    trainingCards === 1 &&
    woodcuttingClass?.includes("is-training-skill") &&
    !attackClass?.includes("is-training-skill") &&
    storedRap < 10000 &&
    Number(woodcutting?.currentXp) > 0 &&
    overflow.bodyScrollWidth === overflow.clientWidth &&
    overflow.bodyScrollHeight === overflow.clientHeight &&
    messages.length === 0
  );
} catch (error) {
  failure = error.message;
} finally {
  await browser.close();
}

console.log(JSON.stringify({
  baseUrl,
  failure,
  messages,
  ok,
  result,
}, null, 2));

if (!ok) {
  process.exitCode = 1;
}
