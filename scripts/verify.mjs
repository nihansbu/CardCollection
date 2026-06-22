import { chromium } from "playwright-core";
import {
  applySkillUnlockProgress,
  normalizeSkillUnlocks,
  startSkillUnlock,
} from "./../src/features/skills/skillData.js";

const baseUrl = process.env.RAP_APP_URL ?? "http://127.0.0.1:5173/CardCollection/";
const browser = await chromium.launch({
  args: ["--disable-gpu"],
  channel: "msedge",
  headless: true,
});

const messages = [];

const context = await browser.newContext({ isMobile: true, viewport: { width: 393, height: 852 } });
let page = await context.newPage();

function watchPage(nextPage) {
  nextPage.on("console", (message) => {
    if (message.type() === "error") {
      messages.push(`${message.type()}: ${message.text()}`);
    }
  });

  nextPage.on("pageerror", (error) => {
    messages.push(`pageerror: ${error.message}`);
  });
}

watchPage(page);

let ok = false;
let failure = null;
let result = {};

try {
  const lowRapStartedUnlocks = startSkillUnlock({
    skillLevel: 5,
    unlockId: "woodcutting-oak-logs",
    unlocks: startSkillUnlock({
      skillLevel: 5,
      unlockId: "woodcutting-willow-logs",
      unlocks: normalizeSkillUnlocks([]),
    }),
  });
  const lowRapUnlockState = applySkillUnlockProgress({
    elapsedSeconds: 3600,
    rap: 100,
    unlocks: lowRapStartedUnlocks,
  });
  const lowRapOakUnlock = lowRapUnlockState.unlocks.find((unlock) => unlock.id === "woodcutting-oak-logs");
  const lowRapWillowUnlock = lowRapUnlockState.unlocks.find((unlock) => unlock.id === "woodcutting-willow-logs");

  await page.addInitScript(() => {
    localStorage.setItem("codex-collector-v1-rap", "10000");
    localStorage.removeItem("codex-collector-v1-local-account-credentials");
    localStorage.removeItem("codex-collector-v1-local-account-session");
    localStorage.removeItem("codex-collector-v1-skills");
    localStorage.setItem("codex-collector-v1-skill-training-slots", JSON.stringify(["Woodcutting", null, null]));
    localStorage.setItem("codex-collector-v1-skill-training-last-tick", String(Date.now() - 60000));
    localStorage.removeItem("codex-collector-v1-skill-unlocks");
    localStorage.setItem("codex-collector-v1-skill-unlock-last-tick", String(Date.now()));
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: /^Account$/i }).waitFor({ timeout: 5000 });
  await page.getByLabel("Username").fill("Niklas");
  await page.getByLabel("Password").first().fill("secure-test-password");
  await page.getByLabel("Repeat Password").fill("secure-test-password");
  await page.getByRole("button", { name: /Create Account/i }).click();
  await page.locator(".bottom-nav-item[aria-label='Skills']").waitFor({ timeout: 5000 });
  const bottomNavLabels = await page.locator(".bottom-nav-label").allTextContents();
  await page.locator('.bottom-nav-item[aria-label="More"]').click();
  await page.getByRole("menuitem", { name: /Codex/i }).waitFor({ timeout: 5000 });
  const moreFlyoutLabels = await page.locator(".more-flyout .bottom-nav-flyout-item span").allTextContents();
  await page.locator('.bottom-nav-item[aria-label="More"]').click();
  await page.locator('.bottom-nav-item[aria-label="Character"]').click();
  await page.getByRole("menuitem", { name: /Account/i }).click();
  await page.getByRole("heading", { name: /^Account$/i }).waitFor({ timeout: 5000 });
  const accountStatsText = await page.locator(".content-stats").innerText();

  await page.locator('.bottom-nav-item[aria-label="Skills"]').click();
  await page.getByRole("heading", { name: /^Skills$/i }).waitFor({ timeout: 5000 });

  const trainingCards = await page.locator(".skill-card.is-training-skill").count();
  let woodcuttingButton = page.getByRole("button", { name: /Woodcutting/i });
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll(".skill-sprite img")).slice(0, 10);
    return images.length >= 10 && images.every((image) => image.complete && image.naturalWidth > 0);
  }, { timeout: 5000 });
  const skillImageMetrics = await page.locator(".skill-sprite img").evaluateAll((images) => images.slice(0, 10).map((image) => ({
    complete: image.complete,
    naturalHeight: image.naturalHeight,
    naturalWidth: image.naturalWidth,
    src: image.getAttribute("src"),
  })));
  const woodcuttingClass = await woodcuttingButton.getAttribute("class");
  const attackClass = await page.getByRole("button", { name: /Attack/i }).getAttribute("class");
  const woodcuttingCardText = await woodcuttingButton.innerText();

  await woodcuttingButton.click();
  await page.getByRole("heading", { name: /^Woodcutting$/i }).waitFor({ timeout: 5000 });
  const skillDetailActionText = await page.locator(".content-actions").innerText();
  const skillDetailStatsText = await page.locator(".content-stats").innerText();
  const skillDetailStatLabels = await page.locator(".skill-detail-panel .content-stats dt").allTextContents();
  const skillDetailHeroCount = await page.locator(".skill-detail-shell").count();
  const normalLogsClass = await page.getByRole("button", { name: /Normal Logs/i }).getAttribute("class");
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll(".skill-unlock-icon img")).slice(0, 6);
    return images.length >= 6 && images.every((image) => image.complete && image.naturalWidth > 0);
  }, { timeout: 5000 });
  const unlockImageMetrics = await page.locator(".skill-unlock-icon img").evaluateAll((images) => images.slice(0, 6).map((image) => ({
    complete: image.complete,
    naturalHeight: image.naturalHeight,
    naturalWidth: image.naturalWidth,
    src: image.getAttribute("src"),
  })));
  const oakLogsButton = page.getByRole("button", { name: /Oak Logs/i });
  const oakLogsClassBefore = await oakLogsButton.getAttribute("class");
  const willowLogsClass = await page.getByRole("button", { name: /Willow Logs/i }).getAttribute("class");
  await oakLogsButton.click();
  await page.waitForTimeout(1300);
  const oakLogsClassAfter = await oakLogsButton.getAttribute("class");
  const oakLogsTextAfter = await oakLogsButton.innerText();
  const oakLogsProgressStyleAfter = await oakLogsButton.evaluate((node) => window.getComputedStyle(node).getPropertyValue("--unlock-progress").trim());
  const normalLogsProgressStyle = await page.getByRole("button", { name: /Normal Logs/i }).evaluate((node) => window.getComputedStyle(node).getPropertyValue("--unlock-progress").trim());
  const storedUnlocksAfterClick = JSON.parse(await page.evaluate(() => localStorage.getItem("codex-collector-v1-skill-unlocks")));
  const oakUnlockAfterClick = storedUnlocksAfterClick.find((unlock) => unlock.id === "woodcutting-oak-logs");
  await page.evaluate(() => {
    localStorage.setItem("codex-collector-v1-skill-unlock-last-tick", String(Date.now() - 10 * 60 * 1000));
  });
  await page.close();
  page = await context.newPage();
  watchPage(page);
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.locator(".bottom-nav-item[aria-label='Skills']").waitFor({ timeout: 5000 });
  await page.getByRole("button", { name: /Woodcutting/i }).click();
  await page.getByRole("heading", { name: /^Woodcutting$/i }).waitFor({ timeout: 5000 });
  const oakLogsClassAfterOffline = await page.getByRole("button", { name: /Oak Logs/i }).getAttribute("class");
  const storedUnlocksAfterOffline = JSON.parse(await page.evaluate(() => localStorage.getItem("codex-collector-v1-skill-unlocks")));
  const oakUnlockAfterOffline = storedUnlocksAfterOffline.find((unlock) => unlock.id === "woodcutting-oak-logs");
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
  woodcuttingButton = page.getByRole("button", { name: /Woodcutting/i });

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
    bottomNavLabels,
    moreFlyoutLabels,
    overflow,
    quicklookLabels,
    quicklookValuesAfter,
    quicklookValuesBefore,
    oldStatQuicklookCount,
    sharedQuicklookCount,
    skillDetailActionText,
    skillDetailHeroCount,
    skillDetailStatLabels,
    skillDetailStatsText,
    skillDetailTopbar,
    skillImageMetrics,
    normalLogsClass,
    unlockImageMetrics,
    oakLogsClassAfter,
    oakLogsClassAfterOffline,
    oakLogsClassBefore,
    oakLogsProgressStyleAfter,
    oakLogsTextAfter,
    oakUnlockAfterClick,
    oakUnlockAfterOffline,
    normalLogsProgressStyle,
    lowRapOakUnlock,
    lowRapRemainingRap: lowRapUnlockState.rap,
    lowRapWillowUnlock,
    statQuicklookText,
    storedRap,
    trainingCards,
    willowLogsClass,
    woodcuttingCardText,
    woodcuttingClass,
    woodcuttingLevel: woodcutting?.level,
    woodcuttingXp: woodcutting?.currentXp,
  };

  ok = (
    trainingCards === 1 &&
    accountStatsText.includes("Niklas") &&
    accountStatsText.includes("Account") &&
    bottomNavLabels.join("|") === "Char|Skills|Inv|Slot1|Slot2|Slot3|Slot4|More" &&
    moreFlyoutLabels.join("|") === "Act|Beast|Codex" &&
    skillDetailActionText.includes("SKILLS") &&
    skillDetailStatsText.includes("RAP") &&
    skillDetailStatLabels.join("|") === "RAP|Level|Current XP|XP to Next Level" &&
    skillDetailHeroCount === 0 &&
    skillDetailTopbar.backInsideTitle &&
    skillDetailTopbar.backLeftOffset <= 12 &&
    Math.abs(skillDetailTopbar.titleAreaCenter - skillDetailTopbar.titleCenter) <= 2 &&
    skillDetailTopbar.titleFits &&
    skillImageMetrics.length >= 10 &&
    skillImageMetrics.every((image) => image.complete && image.naturalWidth === 128 && image.naturalHeight === 128) &&
    normalLogsClass?.includes("is-unlocked") &&
    unlockImageMetrics.length >= 6 &&
    unlockImageMetrics.every((image) => image.complete && image.naturalWidth === 128 && image.naturalHeight === 128) &&
    oakLogsClassBefore?.includes("is-available") &&
    oakLogsClassAfter?.includes("is-unlocking") &&
    oakLogsClassAfterOffline?.includes("is-unlocked") &&
    oakLogsTextAfter.toUpperCase().includes("RAP LEFT") &&
    Number.parseFloat(oakLogsProgressStyleAfter) > 0 &&
    normalLogsProgressStyle === "100%" &&
    Number(oakUnlockAfterClick?.progressRap) > 0 &&
    oakUnlockAfterOffline?.status === "unlocked" &&
    lowRapUnlockState.rap === 0 &&
    lowRapOakUnlock?.status === "unlocking" &&
    lowRapWillowUnlock?.status === "unlocking" &&
    Number(lowRapOakUnlock?.progressRap) > 0 &&
    Number(lowRapWillowUnlock?.progressRap) > 0 &&
    willowLogsClass?.includes("is-locked") &&
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
