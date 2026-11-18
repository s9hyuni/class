// clasp(Apps Script 명령줄 도구)를 부르는 짧은 래퍼입니다.
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
const CONFIG = "public/config.js";
const CREATE_DIR = ".runtime/gas-create";
const LOGIN = "로그인이 만료됐으면 npm.cmd run gas:login(macOS: npm run gas:login)을 다시 실행하세요.";
const NO_ID = "clasp 출력에서 배포 ID를 찾지 못했습니다. 위 출력을 확인하고, " + LOGIN;
const NO_URL = "public/config.js에 웹 앱 주소가 없습니다. 먼저 npm.cmd run gas:deploy(macOS: npm run gas:deploy)를 실행하세요.";

function fail(message) { console.error(message); process.exit(1); }

function clasp(...args) {
  const quote = (value) => /\s/.test(value) ? `"${value.replaceAll('"', '\\"')}"` : value;
  const result = spawnSync("npx " + ["--yes", "@google/clasp@3.4.1", ...args].map(quote).join(" "), { encoding: "utf8", shell: true, stdio: ["inherit", "pipe", "pipe"] });
  process.stdout.write(result.stdout || "");
  process.stderr.write(result.stderr || "");
  if (result.error || result.status !== 0) fail(LOGIN);
  return result.stdout;
}

function webApp(text) {
  const value = (text.match(/apiBaseUrl\s*:\s*["']([^"']*)["']/) || [])[1] || "";
  const found = value.match(/^https:\/\/script\.google\.com\/macros\/s\/(AKfyc[A-Za-z0-9_-]+)\/exec$/);
  return found ? { url: found[0], id: found[1] } : null;
}

function create() {
  rmSync(CREATE_DIR, { recursive: true, force: true });
  mkdirSync(CREATE_DIR, { recursive: true });
  const output = clasp("create-script", "--type", "standalone", "--title", "텀블공장 개인 백엔드", "--rootDir", CREATE_DIR);
  const message = "clasp가 프로젝트를 만들지 못했습니다. 위 출력을 확인하고, " + LOGIN;
  if (!/^Created new script: .+/m.test(output)) fail(message);
  let settings;
  try { settings = JSON.parse(readFileSync(".clasp.json", "utf8")); }
  catch { fail(message); }
  if (typeof settings?.scriptId !== "string" || !settings.scriptId.trim()) fail(message);
  settings.rootDir = "gas";
  writeFileSync(".clasp.json", JSON.stringify(settings, null, 2) + "\n");
  console.log(".clasp.json이 gas 폴더를 가리키게 했습니다. 다음: npm.cmd run gas:push(macOS: npm run gas:push)");
}

function deploy() {
  const text = readFileSync(CONFIG, "utf8");
  if (webApp(text)) fail("이미 배포 주소가 있습니다. npm.cmd run gas:redeploy(macOS: npm run gas:redeploy)로 갱신하세요.");
  const output = clasp("create-deployment", "--description", "dashboard");
  const rows = [...output.matchAll(/^Deployed (AKfyc[A-Za-z0-9_-]+) @(?:\d+|HEAD)\r?$/gm)];
  if (rows.length !== 1) fail(NO_ID);
  const url = "https://script.google.com/macros/s/" + rows[0][1] + "/exec";
  writeFileSync(CONFIG, text.replace(/(apiBaseUrl\s*:\s*)(["'])[^"']*\2/, (_, key, quote) => key + quote + url + quote).replace(/(timeoutMs\s*:\s*)\d+/, (_, key) => key + "15000"));
  console.log("public/config.js에 웹 앱 주소와 timeoutMs 15000을 적었습니다.");
}

function redeploy() {
  const app = webApp(readFileSync(CONFIG, "utf8"));
  if (!app) fail(NO_URL);
  const output = clasp("update-deployment", app.id, "--description", "dashboard");
  const success = new RegExp("^Redeployed " + app.id + " @(?:\\d+|HEAD)\\r?$", "m");
  if (!success.test(output)) fail(NO_ID);
  console.log("같은 배포를 새 버전으로 갱신했습니다. 주소는 그대로입니다.");
}

function open() {
  const app = webApp(readFileSync(CONFIG, "utf8"));
  if (!app) fail(NO_URL);
  const target = app.url + "?path=/api/v1/snapshot";
  console.log("브라우저로 엽니다. JSON이 보이면 웹 앱이 동작합니다.\n" + target);
  const opener = process.platform === "win32" ? 'start ""' : process.platform === "darwin" ? "open" : "xdg-open";
  const result = spawnSync(opener + ' "' + target + '"', { shell: true, stdio: "inherit" });
  if (result.error || result.status !== 0) fail("브라우저를 열지 못했습니다. 위 주소를 직접 열어 주세요.");
}

function main(args) {
  const name = args[2] || "";
  if (!["create", "deploy", "redeploy", "open"].includes(name)) fail("사용법: node scripts/gas-clasp.mjs create|deploy|redeploy|open");
  if (name === "create") create(); else if (name === "deploy") deploy(); else if (name === "redeploy") redeploy(); else open();
}

main(process.argv);
