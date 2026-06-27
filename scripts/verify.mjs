import { chromium } from "playwright-core";
import {
  applySkillUnlockProgress,
  normalizeSkillUnlocks,
  resolveTrainingSlotSelection,
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

async function readContentHeaderMetrics(nextPage) {
  await expandContentHeader(nextPage);

  return nextPage.evaluate(() => {
    const readRect = (selector) => {
      const node = document.querySelector(selector);
      const rect = node.getBoundingClientRect();

      return {
        height: Math.round(rect.height),
        width: Math.round(rect.width),
        x: Math.round(rect.x),
        y: Math.round(rect.y),
      };
    };

    return {
      actions: readRect(".content-actions"),
      header: readRect(".content-header"),
      stats: readRect(".content-stats"),
      title: readRect(".content-title-box"),
    };
  });
}

async function expandContentHeader(nextPage) {
  const toggle = nextPage.locator(".content-header-toggle").first();
  await toggle.waitFor({ timeout: 5000 });

  if ((await toggle.getAttribute("aria-expanded")) === "false") {
    await toggle.click();
  }

  await nextPage.locator(".content-header.is-expanded").waitFor({ timeout: 5000 });
  await nextPage.waitForFunction(() => {
    const header = document.querySelector(".content-header.is-expanded");
    return header && header.getBoundingClientRect().height >= 120;
  }, { timeout: 5000 });
  await nextPage.waitForTimeout(240);
}

async function readContentHeaderCollapsed(nextPage) {
  return nextPage.evaluate(() => {
    const panel = document.querySelector(".codex-content-panel");
    const toggle = document.querySelector(".content-header-toggle");
    const toggleRect = toggle?.getBoundingClientRect();

    return {
      collapsed: panel?.classList.contains("is-header-collapsed") ?? false,
      expanded: toggle?.getAttribute("aria-expanded") === "true",
      toggleVisible: Boolean(toggleRect && toggleRect.width >= 50 && toggleRect.height <= 20),
    };
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
  const autoFillSlot2 = resolveTrainingSlotSelection({
    selectedSlot: 0,
    skillName: "Summoning",
    slots: ["Woodcutting", null, null],
  });
  const autoFillSlot3 = resolveTrainingSlotSelection({
    selectedSlot: autoFillSlot2.nextSelectedSlot,
    skillName: "Cooking",
    slots: autoFillSlot2.slots,
  });
  const autoRemoveSlot2 = resolveTrainingSlotSelection({
    selectedSlot: autoFillSlot3.nextSelectedSlot,
    skillName: "Summoning",
    slots: autoFillSlot3.slots,
  });
  const manualReplaceSlot1 = resolveTrainingSlotSelection({
    isManualSlotSelection: true,
    selectedSlot: 0,
    skillName: "Strength",
    slots: ["Woodcutting", null, null],
  });

  await page.addInitScript(() => {
    localStorage.setItem("codex-collector-v1-rap", "10000");
    localStorage.removeItem("codex-collector-v1-local-account-credentials");
    localStorage.removeItem("codex-collector-v1-local-account-session");
    localStorage.removeItem("codex-collector-v1-skills");
    localStorage.removeItem("codex-collector-v1-quests");
    localStorage.setItem("codex-collector-v1-quest-last-tick", String(Date.now()));
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
  await page.locator('.bottom-nav-item[aria-label="Deeds"]').click();
  await page.getByRole("heading", { name: /^Deeds$/i }).waitFor({ timeout: 5000 });
  const deedHeaderCollapsedState = await readContentHeaderCollapsed(page);
  const deedRows = await page.locator(".deed-card").count();
  const deedGoalStripCount = await page.locator(".deed-goal-strip").count();
  const deedGoalSegmentCount = await page.locator(".deed-goal-strip-segments i").count();
  const activeDeedGoalBefore = await page.locator('.deed-goal-strip[aria-pressed="true"]').innerText();
  await page.getByRole("button", { name: /Dailies/i }).click();
  const activeDeedGoalAfterRepeatTap = await page.locator('.deed-goal-strip[aria-pressed="true"]').innerText();
  const deedGridColumns = await page.locator(".deed-grid").evaluate((node) => window.getComputedStyle(node).gridTemplateColumns.split(" ").length);
  const stepsDeed = page.getByRole("button", { name: /Steps/i });
  await stepsDeed.waitFor({ timeout: 5000 });
  const stepsText = await stepsDeed.innerText();
  const walkingDeed = page.getByRole("button", { name: /Walking/i });
  await walkingDeed.dispatchEvent("pointerdown");
  await page.waitForTimeout(620);
  await walkingDeed.dispatchEvent("pointerup");
  await page.locator(".content-info-panel", { hasText: /Walking/i }).waitFor({ timeout: 5000 });
  const deedQuicklookText = await page.locator(".content-info-panel").innerText();
  await page.locator(".deed-preset-row button").last().click();
  const deedRewardPreviewText = await page.locator(".deed-reward-preview").innerText();
  await page.getByLabel("Close info panel").click();
  const rapBeforeDeedTap = Number(await page.evaluate(() => localStorage.getItem("codex-collector-v1-rap")));
  await page.getByRole("button", { name: /Running/i }).click();
  const rapAfterDeedTap = Number(await page.evaluate(() => localStorage.getItem("codex-collector-v1-rap")));
  const deedLogAfterTap = JSON.parse(await page.evaluate(() => localStorage.getItem("codex-collector-v1-deed-log")));
  const deedHeaderMetrics = await readContentHeaderMetrics(page);

  await page.locator('.bottom-nav-item[aria-label="Quests"]').click();
  await page.getByRole("heading", { name: /^Quests$/i }).waitFor({ timeout: 5000 });
  const questHeaderCollapsedState = await readContentHeaderCollapsed(page);
  const questRows = await page.locator(".quest-tile").count();
  const firstStepsQuest = page.getByRole("button", { name: /First Steps/i });
  const firstQuestTilePseudoContent = await page.locator(".quest-tile").first().evaluate((node) => window.getComputedStyle(node, "::after").content);
  const firstQuestTileBackground = await page.locator(".quest-tile").first().evaluate((node) => window.getComputedStyle(node).backgroundImage);
  const questHeaderLabels = await page.locator(".quests-panel .content-stats dt").allTextContents();
  const questHeaderText = await page.locator(".quests-panel .content-stats").innerText();
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll(".quest-tile-icon img")).slice(0, 5);
    return images.length >= 5 && images.every((image) => image.complete && image.naturalWidth > 0);
  }, { timeout: 5000 });
  const questImageMetrics = await page.locator(".quest-tile-icon img").evaluateAll((images) => images.slice(0, 5).map((image) => ({
    complete: image.complete,
    naturalHeight: image.naturalHeight,
    naturalWidth: image.naturalWidth,
    src: image.getAttribute("src"),
  })));
  await firstStepsQuest.dispatchEvent("pointerdown");
  await page.waitForTimeout(620);
  await firstStepsQuest.dispatchEvent("pointerup");
  await page.locator(".content-info-panel", { hasText: /First Steps/i }).waitFor({ timeout: 5000 });
  const questQuicklookText = await page.locator(".content-info-panel").innerText();
  await page.getByLabel("Close info panel").click();
  await expandContentHeader(page);
  await page.locator(".content-action-button", { hasText: "Sort" }).click();
  await page.locator(".quest-sort-menu").waitFor({ timeout: 5000 });
  const questSortOptions = await page.locator(".quest-sort-menu button").allTextContents();
  await page.locator(".quest-sort-menu button", { hasText: "Highest Quest Points" }).click();
  const firstQuestAfterQuestPointSort = await page.locator(".quest-tile").first().getAttribute("aria-label");
  const cooksAssistantClassBefore = await page.getByRole("button", { name: /Cook's Assistant/i }).getAttribute("class");
  await page.getByRole("button", { name: /Cook's Assistant/i }).click();
  await page.waitForTimeout(1200);
  const cooksAssistantClassAfter = await page.getByRole("button", { name: /Cook's Assistant/i }).getAttribute("class");
  const storedQuestsAfterClick = JSON.parse(await page.evaluate(() => localStorage.getItem("codex-collector-v1-quests")));
  const cooksAssistantQuestAfterClick = storedQuestsAfterClick.find((quest) => quest.id === "cooks-assistant");
  const questBoardColumns = await page.locator(".quest-board").evaluate((node) => window.getComputedStyle(node).gridTemplateColumns.split(" ").length);
  const questHeaderMetrics = await readContentHeaderMetrics(page);

  await page.locator('.bottom-nav-item[aria-label="Skills"]').click();
  await page.getByRole("heading", { name: /^Skills$/i }).waitFor({ timeout: 5000 });
  const skillsHeaderCollapsedState = await readContentHeaderCollapsed(page);
  const skillsHeaderMetrics = await readContentHeaderMetrics(page);

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
  const skillDetailHeaderCollapsedState = await readContentHeaderCollapsed(page);
  await expandContentHeader(page);
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
  await expandContentHeader(page);
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
  await expandContentHeader(page);
  woodcuttingButton = page.getByRole("button", { name: /Woodcutting/i });

  await woodcuttingButton.dispatchEvent("pointerdown");
  await page.waitForTimeout(620);
  await woodcuttingButton.dispatchEvent("pointerup");
  await page.locator(".content-info-panel").waitFor({ timeout: 5000 });
  const quicklookLabels = await page.locator(".content-info-panel dt").allTextContents();
  const quicklookValuesBefore = await page.locator(".content-info-panel dd").allTextContents();
  await page.waitForTimeout(1200);
  const quicklookValuesAfter = await page.locator(".content-info-panel dd").allTextContents();

  await page.locator(".content-stats > div").first().dispatchEvent("pointerdown");
  await page.waitForTimeout(620);
  await page.locator(".content-stats > div").first().dispatchEvent("pointerup");
  await page.locator(".content-info-panel").filter({ hasText: "TOTAL LEVEL" }).waitFor({ timeout: 5000 });
  const statQuicklookText = await page.locator(".content-info-panel").innerText();
  const oldStatQuicklookCount = await page.locator(".content-stat-quicklook").count();
  const sharedQuicklookCount = await page.locator(".content-info-panel").count();

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
    deedLogAfterTap,
    deedHeaderMetrics,
    deedHeaderCollapsedState,
    activeDeedGoalAfterRepeatTap,
    activeDeedGoalBefore,
    deedGoalSegmentCount,
    deedGoalStripCount,
    deedGridColumns,
    deedQuicklookText,
    deedRewardPreviewText,
    deedRows,
    stepsText,
    bottomNavLabels,
    cooksAssistantClassAfter,
    cooksAssistantClassBefore,
    cooksAssistantQuestAfterClick,
    moreFlyoutLabels,
    overflow,
    quicklookLabels,
    quicklookValuesAfter,
    quicklookValuesBefore,
    firstQuestAfterQuestPointSort,
    firstQuestTileBackground,
    firstQuestTilePseudoContent,
    questHeaderLabels,
    questHeaderCollapsedState,
    questHeaderText,
    questImageMetrics,
    questBoardColumns,
    questHeaderMetrics,
    questQuicklookText,
    questRows,
    questSortOptions,
    oldStatQuicklookCount,
    sharedQuicklookCount,
    skillsHeaderCollapsedState,
    skillsHeaderMetrics,
    skillDetailHeaderCollapsedState,
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
    slotAutomation: {
      autoFillSlot2,
      autoFillSlot3,
      autoRemoveSlot2,
      manualReplaceSlot1,
    },
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
    deedRows >= 7 &&
    deedHeaderCollapsedState.collapsed &&
    !deedHeaderCollapsedState.expanded &&
    deedHeaderCollapsedState.toggleVisible &&
    deedGoalStripCount === 3 &&
    deedGoalSegmentCount === 0 &&
    deedGridColumns === 4 &&
    activeDeedGoalBefore.toUpperCase().includes("DAILIES") &&
    activeDeedGoalAfterRepeatTap.toUpperCase().includes("DAILIES") &&
    stepsText.toUpperCase().includes("STEPS") &&
    stepsText.toUpperCase().includes("LV") &&
    stepsText.includes("%") &&
    !stepsText.toUpperCase().includes("DAILY") &&
    !stepsText.toUpperCase().includes("WEEKLY") &&
    !stepsText.toUpperCase().includes("MONTHLY") &&
    deedQuicklookText.toUpperCase().includes("WALKING") &&
    deedQuicklookText.toUpperCase().includes("REWARD") &&
    deedRewardPreviewText.toUpperCase().includes("RAP") &&
    rapAfterDeedTap > rapBeforeDeedTap &&
    Array.isArray(deedLogAfterTap) &&
    deedLogAfterTap[0]?.title === "Running" &&
    Number(deedLogAfterTap[0]?.goalBonusRap) > 0 &&
    deedHeaderMetrics.header.height === skillsHeaderMetrics.header.height &&
    deedHeaderMetrics.title.width === skillsHeaderMetrics.title.width &&
    deedHeaderMetrics.actions.width === skillsHeaderMetrics.actions.width &&
    deedHeaderMetrics.stats.y === skillsHeaderMetrics.stats.y &&
    deedHeaderMetrics.stats.height === skillsHeaderMetrics.stats.height &&
    bottomNavLabels.join("|") === "Char|Deed|Skills|Inv|Quest|Slot2|Slot3|More" &&
    questRows >= 12 &&
    questHeaderCollapsedState.collapsed &&
    !questHeaderCollapsedState.expanded &&
    questHeaderCollapsedState.toggleVisible &&
    questBoardColumns === 5 &&
    questHeaderLabels.join("|") === "RAP|Unlocked|Available|Quest Points" &&
    questHeaderText.includes("/") &&
    questImageMetrics.length >= 5 &&
    questImageMetrics.every((image) => image.complete && image.naturalWidth === 128 && image.naturalHeight === 128) &&
    questQuicklookText.toUpperCase().includes("FIRST STEPS") &&
    questQuicklookText.toUpperCase().includes("RAP COST") &&
    questQuicklookText.toUpperCase().includes("QUEST POINTS") &&
    firstQuestTilePseudoContent === "none" &&
    !firstQuestTileBackground.includes("radial-gradient") &&
    questSortOptions.includes("Highest Quest Points") &&
    questSortOptions.includes("Locked") &&
    firstQuestAfterQuestPointSort?.includes("Ein Kleiner Gefallen") &&
    cooksAssistantClassBefore?.includes("is-available") &&
    cooksAssistantClassAfter?.includes("is-unlocking") &&
    Number(cooksAssistantQuestAfterClick?.progressRap) > 0 &&
    questHeaderMetrics.header.height === skillsHeaderMetrics.header.height &&
    questHeaderMetrics.title.width === skillsHeaderMetrics.title.width &&
    questHeaderMetrics.actions.width === skillsHeaderMetrics.actions.width &&
    moreFlyoutLabels.join("|") === "Beast|Codex" &&
    skillsHeaderCollapsedState.collapsed &&
    !skillsHeaderCollapsedState.expanded &&
    skillsHeaderCollapsedState.toggleVisible &&
    skillDetailActionText.includes("SKILLS") &&
    skillDetailHeaderCollapsedState.collapsed &&
    !skillDetailHeaderCollapsedState.expanded &&
    skillDetailHeaderCollapsedState.toggleVisible &&
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
    autoFillSlot2.slots.join("|") === "Woodcutting|Summoning|" &&
    autoFillSlot2.nextSelectedSlot === 2 &&
    autoFillSlot3.slots.join("|") === "Woodcutting|Summoning|Cooking" &&
    autoFillSlot3.nextSelectedSlot === 0 &&
    autoRemoveSlot2.slots.join("|") === "Woodcutting||Cooking" &&
    autoRemoveSlot2.nextSelectedSlot === 1 &&
    manualReplaceSlot1.slots.join("|") === "Strength||" &&
    manualReplaceSlot1.nextSelectedSlot === 1 &&
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
    storedRap > 10000 &&
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
