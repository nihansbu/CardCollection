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
    localStorage.removeItem("codex-collector-v1-local-account-credentials");
    localStorage.removeItem("codex-collector-v1-local-account-session");
    localStorage.removeItem("codex-collector-v1-skills");
    localStorage.setItem("codex-collector-v1-skill-training-slots", JSON.stringify(["Woodcutting", null, null]));
    localStorage.setItem("codex-collector-v1-skill-training-last-tick", String(Date.now() - 60000));
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: /^Account$/i }).waitFor({ timeout: 5000 });
  await page.getByLabel("Username").fill("Niklas");
  await page.getByLabel("Password").first().fill("secure-test-password");
  await page.getByLabel("Repeat Password").fill("secure-test-password");
  await page.getByRole("button", { name: /Create Account/i }).click();
  await page.locator(".bottom-nav-item[aria-label='Skills']").waitFor({ timeout: 5000 });
  await page.locator('.bottom-nav-item[aria-label="Character"]').click();
  await page.getByRole("menuitem", { name: /Account/i }).click();
  await page.getByRole("heading", { name: /^Account$/i }).waitFor({ timeout: 5000 });
  const accountStatsText = await page.locator(".content-stats").innerText();

  await page.locator('.bottom-nav-item[aria-label="Skills"]').click();
  await page.getByRole("heading", { name: /^Skills$/i }).waitFor({ timeout: 5000 });

  const trainingCards = await page.locator(".skill-card.is-training-skill").count();
  const woodcuttingButton = page.getByRole("button", { name: /Woodcutting/i });
  const woodcuttingClass = await woodcuttingButton.getAttribute("class");
  const attackClass = await page.getByRole("button", { name: /Attack/i }).getAttribute("class");
  const woodcuttingCardText = await woodcuttingButton.innerText();

  await woodcuttingButton.click();
  await page.getByRole("heading", { name: /^Woodcutting$/i }).waitFor({ timeout: 5000 });
  const skillDetailActionText = await page.locator(".content-actions").innerText();
  const skillDetailTopbar = await page.locator(".content-title-box").evaluate((node) => {
    const box = node.getBoundingClientRect();
    const titleNode = node.querySelector("h1");
    const title = titleNode.getBoundingClientRect();
    const back = node.querySelector(".content-back-button").getBoundingClientRect();
    const styles = window.getComputedStyle(node);
    const titleAreaLeft = back.right + Number.parseFloat(styles.columnGap || styles.gap || "0");
    const titleAreaRight = box.right - Number.parseFloat(styles.paddingRight || "0");

    return {
      backInsideTitle: back.left >= box.left && back.right <= box.right,
      backLeftOffset: Math.round(back.left - box.left),
      titleAreaCenter: Math.round(titleAreaLeft + (titleAreaRight - titleAreaLeft) / 2),
      titleCenter: Math.round(title.left + title.width / 2),
      titleFits: titleNode.scrollWidth <= titleNode.clientWidth + 1,
    };
  });
  await page.locator(".content-action-button", { hasText: "Skills" }).click();
  await page.getByRole("heading", { name: /^Skills$/i }).waitFor({ timeout: 5000 });

  await woodcuttingButton.dispatchEvent("pointerdown");
  await page.waitForTimeout(620);
  await woodcuttingButton.dispatchEvent("pointerup");
  await page.locator(".skill-quicklook").waitFor({ timeout: 5000 });
  const quicklookLabels = await page.locator(".skill-quicklook dt").allTextContents();
  const quicklookValuesBefore = await page.locator(".skill-quicklook dd").allTextContents();
  await page.waitForTimeout(1200);
  const quicklookValuesAfter = await page.locator(".skill-quicklook dd").allTextContents();

  await page.locator(".content-stats > div").first().dispatchEvent("pointerdown");
  await page.waitForTimeout(620);
  await page.locator(".content-stats > div").first().dispatchEvent("pointerup");
  await page.locator(".skill-quicklook").filter({ hasText: "TOTAL LEVEL" }).waitFor({ timeout: 5000 });
  const statQuicklookText = await page.locator(".skill-quicklook").innerText();
  const oldStatQuicklookCount = await page.locator(".content-stat-quicklook").count();
  const sharedQuicklookCount = await page.locator(".skill-quicklook").count();

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
    accountStatsText,
    overflow,
    quicklookLabels,
    quicklookValuesAfter,
    quicklookValuesBefore,
    oldStatQuicklookCount,
    sharedQuicklookCount,
    skillDetailActionText,
    skillDetailTopbar,
    statQuicklookText,
    storedRap,
    trainingCards,
    woodcuttingCardText,
    woodcuttingClass,
    woodcuttingLevel: woodcutting?.level,
    woodcuttingXp: woodcutting?.currentXp,
  };

  ok = (
    trainingCards === 1 &&
    accountStatsText.includes("Niklas") &&
    accountStatsText.includes("Account") &&
    skillDetailActionText.includes("SKILLS") &&
    skillDetailTopbar.backInsideTitle &&
    skillDetailTopbar.backLeftOffset <= 12 &&
    Math.abs(skillDetailTopbar.titleAreaCenter - skillDetailTopbar.titleCenter) <= 2 &&
    skillDetailTopbar.titleFits &&
    woodcuttingClass?.includes("is-training-skill") &&
    !attackClass?.includes("is-training-skill") &&
    woodcuttingCardText.includes("WOODCUTTING") &&
    quicklookLabels.includes("Current XP") &&
    quicklookLabels.includes("XP to Next Level") &&
    quicklookValuesBefore[1] !== quicklookValuesAfter[1] &&
    quicklookValuesAfter[2]?.includes("(") &&
    statQuicklookText.includes("TOTAL LEVEL") &&
    oldStatQuicklookCount === 0 &&
    sharedQuicklookCount === 1 &&
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
