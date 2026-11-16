// Plays one complete participant session in a real browser against the built
// site, checks what gets recorded, and saves a screenshot of each interface.
//
//   npm run build && node scripts/e2e-walkthrough.mjs [participantNumber] [outDir]
//
// Needs Microsoft Edge or Chrome installed. Takes about two minutes, because
// the four required 15-second reviews run in real time.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}/hci-research-prototype/`;
const VIEWPORT = { width: 1440, height: 900 };
const FORCED_REVIEW_TIMEOUT_MS = 25_000;
const TRIALS_PER_BLOCK = 4;
const BLOCKS = 3;
const COMPLETED_KEY = "deeplink_completed_sessions_v2";
const BROWSER_PATHS = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];
const CONDITION_BY_LABEL = {
  "Interface 1": "Baseline",
  "Interface 2": "Voluntary",
  "Interface 3": "Forced",
};

const participantNumber = Number(process.argv[2] ?? 3);
const outDir = resolve(process.argv[3] ?? join(PROJECT_ROOT, "e2e-output"));

function check(condition, message) {
  if (!condition) throw new Error(`CHECK FAILED: ${message}`);
}

async function waitForServer(url, attempts = 60) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Not up yet.
    }
    await new Promise((done) => setTimeout(done, 250));
  }
  throw new Error(`Preview server did not start at ${url}`);
}

async function clickButton(page, text) {
  const clicked = await page.evaluate((wanted) => {
    const button = [...document.querySelectorAll("button")].find(
      (candidate) => candidate.textContent.trim().startsWith(wanted) && !candidate.disabled
    );
    if (!button) return false;
    button.click();
    return true;
  }, text);
  check(clicked, `no enabled button starting with "${text}"`);
}

async function waitForText(page, text, timeout = 10_000) {
  // Case-insensitive: innerText reflects CSS such as text-transform: uppercase.
  await page.waitForFunction(
    (wanted) => document.body.innerText.toLowerCase().includes(wanted.toLowerCase()),
    { timeout },
    text
  );
}

async function chooseRadio(page, name, value) {
  const found = await page.evaluate(
    (radioName, radioValue) => {
      const input = document.querySelector(`input[name="${radioName}"][value="${radioValue}"]`);
      if (!input) return false;
      input.click();
      return true;
    },
    name,
    String(value)
  );
  check(found, `no radio ${name}=${value}`);
}

async function fillAboutYou(page) {
  await waitForText(page, "About you");
  for (const [index, value] of ["25-34", "msc_student", "computer_science", "daily"].entries()) {
    await page.evaluate(
      (selectIndex, selectValue) => {
        const select = document.querySelectorAll("select")[selectIndex];
        const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set;
        setter.call(select, selectValue);
        select.dispatchEvent(new Event("change", { bubbles: true }));
      },
      index,
      value
    );
  }
  await chooseRadio(page, "software-familiarity", 4);
  await clickButton(page, "Continue");
}

async function doTrial(page, shots) {
  await waitForText(page, "AI-generated summary of the report");
  const label = await page.evaluate(
    () => [...document.querySelectorAll("header span")].pop().textContent.trim()
  );
  const condition = CONDITION_BY_LABEL[label];
  check(condition, `unknown interface label "${label}"`);

  const citationButtons = await page.$$("section button");
  const linkCount = (
    await Promise.all(citationButtons.map((b) => b.evaluate((el) => el.textContent.includes("p. "))))
  ).filter(Boolean).length;
  check(
    condition === "Baseline" ? linkCount === 0 : linkCount === 3,
    `${condition} shows ${linkCount} clickable citations`
  );
  check((await page.$("article")) !== null, "the report is visible before any click");

  if (condition !== "Baseline") {
    await page.evaluate(() => {
      const buttons = [...document.querySelectorAll("section button")];
      buttons.filter((b) => b.textContent.includes("p. "))[2].click();
    });
    await page.waitForSelector("mark");
    // The viewer ignores scroll events for a moment after a citation jump, so
    // that its own smooth scroll is not counted as the participant reading.
    await new Promise((done) => setTimeout(done, 600));
  }
  await page.evaluate(() => {
    const viewer = document.querySelector('[aria-label="Source report"]');
    viewer.scrollBy(0, 400);
  });
  // Give the browser a moment to deliver the scroll event before moving on.
  await new Promise((done) => setTimeout(done, 400));

  await chooseRadio(page, "decision", "No");
  if (!shots.has(condition) && condition !== "Forced") {
    await new Promise((done) => setTimeout(done, 700));
    await page.screenshot({ path: join(outDir, `interface_${condition.toLowerCase()}.png`) });
    shots.add(condition);
  }
  await clickButton(page, "Submit decision");

  if (condition === "Forced") {
    await waitForText(page, "Required review");
    const isLocked = await page.evaluate(() =>
      [...document.querySelectorAll("button")].some(
        (b) => b.textContent.includes("Reviewing source") && b.disabled
      )
    );
    check(isLocked, "submit is locked during the required review");
    check((await page.$("mark")) !== null, "the key passage is highlighted during the review");
    if (!shots.has(condition)) {
      await new Promise((done) => setTimeout(done, 900));
      await page.screenshot({ path: join(outDir, "interface_forced.png") });
      shots.add(condition);
    }
    await waitForText(page, "Confirm and submit", FORCED_REVIEW_TIMEOUT_MS);
    await clickButton(page, "Confirm and submit");
  }

  await waitForText(page, "Decision recorded");
  await chooseRadio(page, "confidence", 3);
  await clickButton(page, "Continue");
  return condition;
}

async function fillBlockSurvey(page) {
  await waitForText(page, "Think about the four tasks");
  const names = await page.evaluate(() => [
    ...new Set([...document.querySelectorAll('input[type="radio"]')].map((input) => input.name)),
  ]);
  check(names.length === 6, `block survey has ${names.length} items`);
  for (const [index, name] of names.entries()) {
    await chooseRadio(page, name, (index % 5) + 1);
  }
  await clickButton(page, "Continue");
}

function validateRecord(record, seenConditions) {
  check(record.schema_version === 2, "schema version is 2");
  check(record.participant_number === participantNumber, "participant number recorded");
  check(record.trials.length === 12, "12 trials recorded");
  check(record.block_surveys.length === 3, "3 block surveys recorded");
  check(record.score === 6, `always answering No scores 6, got ${record.score}`);
  check(new Set(record.trials.map((t) => t.scenario_id)).size === 12, "12 different reports");
  check(
    record.trials.map((t) => t.condition).join() === seenConditions.join(),
    "recorded interfaces match what was shown"
  );
  for (const trial of record.trials) {
    const isBaseline = trial.condition === "Baseline";
    check(trial.forced_review_shown === (trial.condition === "Forced"), "forced flag matches");
    check(trial.citation_clicks_count === (isBaseline ? 0 : 1), "click count matches");
    check(
      trial.doc_scroll_events >= 1,
      `manual scrolling was logged in trial ${trial.trial_index} (${trial.condition})`
    );
    check(trial.time_to_decision_ms > 0, "decision time is positive");
    check(trial.decision_correct === (trial.trial_type === "AI-Incorrect"), "correctness derived");
    check((trial.time_to_first_click_ms === null) === isBaseline, "first click time consistent");
    if (trial.condition === "Forced") {
      check(trial.time_to_decision_ms >= 15_000, "forced trials include the 15 s review");
    }
  }
}

async function run() {
  check(existsSync(join(PROJECT_ROOT, "dist", "index.html")), "run `npm run build` first");
  const executablePath = BROWSER_PATHS.find((path) => existsSync(path));
  check(executablePath, "no Chrome or Edge found");
  mkdirSync(outDir, { recursive: true });

  const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
    cwd: PROJECT_ROOT,
    shell: true,
    stdio: "ignore",
  });
  let browser;
  try {
    await waitForServer(BASE_URL);
    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      defaultViewport: VIEWPORT,
      args: ["--no-sandbox", "--disable-gpu", "--no-first-run"],
    });
    const page = await browser.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto(`${BASE_URL}#/?p=${participantNumber}`);
    await waitForText(page, "Before you start");
    await page.click('input[type="checkbox"]');
    await clickButton(page, "Begin");
    await fillAboutYou(page);
    await waitForText(page, "How the study works");
    await clickButton(page, "Continue");

    const shots = new Set();
    const seenConditions = [];
    for (let block = 1; block <= BLOCKS; block += 1) {
      await waitForText(page, `Part ${block} of ${BLOCKS}`);
      await clickButton(page, "Start the tasks");
      for (let trial = 1; trial <= TRIALS_PER_BLOCK; trial += 1) {
        seenConditions.push(await doTrial(page, shots));
      }
      await fillBlockSurvey(page);
    }

    await waitForText(page, "Last questions");
    await chooseRadioByIndex(page, "most-preferred", 1);
    await chooseRadioByIndex(page, "least-preferred", 0);
    await clickButton(page, "Finish");
    await waitForText(page, "6 of 12");

    const stored = await page.evaluate((key) => localStorage.getItem(key), COMPLETED_KEY);
    const record = JSON.parse(stored).at(-1);
    validateRecord(record, seenConditions);
    check(pageErrors.length === 0, `page errors: ${pageErrors.join(" | ")}`);

    const recordPath = join(outDir, `deeplink_${record.participant_id}.json`);
    writeFileSync(recordPath, JSON.stringify({ ...record, simulated: true }, null, 2));
    process.stdout.write(
      `OK: participant ${participantNumber}, order ${record.condition_order}, ` +
        `set rotation ${record.set_rotation}, score ${record.score}/12\n` +
        `Record (marked simulated): ${recordPath}\nScreenshots: ${outDir}\n`
    );
  } finally {
    // Edge can still hold its temporary profile lock when asked to close.
    // That cleanup failure must not hide the result of the run itself.
    if (browser) await browser.close().catch(() => undefined);
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
    } else {
      server.kill();
    }
  }
}

async function chooseRadioByIndex(page, name, index) {
  const found = await page.evaluate(
    (radioName, radioIndex) => {
      const input = document.querySelectorAll(`input[name="${radioName}"]`)[radioIndex];
      if (!input) return false;
      input.click();
      return true;
    },
    name,
    index
  );
  check(found, `no radio ${name}[${index}]`);
}

run().catch((error) => {
  process.stderr.write(`${error.stack ?? error}\n`);
  process.exitCode = 1;
});
