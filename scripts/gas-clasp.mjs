// clasp(Apps Script 명령줄 도구)를 부르는 짧은 래퍼입니다.
// 사용법: node scripts/gas-clasp.mjs create|deploy|redeploy|open
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const CONFIG = "public/config.js";
const CREATE_DIR = ".runtime/gas-create";
const LOGIN = "로그인이 만료됐으면 npm.cmd run gas:login(macOS: npm run gas:login)을 다시 실행하세요.";
const NO_ID = "clasp 출력에서 배포 ID를 찾지 못했습니다. 위 출력을 확인하고, " + LOGIN;
const NO_URL = "public/config.js에 웹 앱 주소가 없습니다. 먼저 npm.cmd run gas:deploy(macOS: npm run gas:deploy)를 실행하세요.";

function fail(message) { console.error(message); process.exit(1); }

// Windows에서도 실행되도록 셸을 거쳐 부르고, 출력은 그대로 보여 준 뒤 돌려줍니다.
function clasp(...args) {
  const result = spawnSync("npx " + ["--yes", "@google/clasp@3.4.1", ...args].join(" "), { encoding: "utf8", shell: true, stdio: ["inherit", "pipe", "pipe"] });
  process.stdout.write(result.stdout || "");
  process.stderr.write(result.stderr || "");
  return (result.stdout || "") + "\n" + (result.stderr || "");
}

// apiBaseUrl이 GAS 웹 앱 주소 모양일 때만 { url, id }를 돌려줍니다.
function webApp(text) {
  const value = (text.match(/apiBaseUrl\s*:\s*["']([^"']*)["']/) || [])[1] || "";
  const found = value.match(/^https:\/\/script\.google\.com\/macros\/s\/(AKfyc[A-Za-z0-9_-]+)\/exec$/);
  return found ? { url: found[0], id: found[1] } : null;
}

function create() {
  rmSync(CREATE_DIR, { recursive: true, force: true });
  mkdirSync(CREATE_DIR, { recursive: true });
  // --rootDir를 gas로 바로 주면 clasp가 기본 파일로 gas를 덮어쓰므로 빈 폴더에 먼저 만듭니다.
  const output = clasp("create-script", "--type", "standalone", "--title", '"텀블공장 개인 백엔드"', "--rootDir", CREATE_DIR);
  if (!output.includes("Created new script")) fail("clasp가 프로젝트를 만들지 못했습니다. 위 출력을 확인하고, " + LOGIN);
  const settings = JSON.parse(readFileSync(".clasp.json", "utf8"));
  settings.rootDir = "gas";
  writeFileSync(".clasp.json", JSON.stringify(settings, null, 2) + "\n");
  console.log(".clasp.json이 gas 폴더를 가리키게 했습니다. 다음: npm.cmd run gas:push(macOS: npm run gas:push)");
}

function deploy() {
  const text = readFileSync(CONFIG, "utf8");
  if (webApp(text)) fail("이미 배포 주소가 있습니다. npm.cmd run gas:redeploy(macOS: npm run gas:redeploy)로 갱신하세요.");
  const ids = [...new Set(clasp("create-deployment", "--description", "dashboard").match(/AKfyc[A-Za-z0-9_-]+/g) || [])];
  if (ids.length !== 1) fail(NO_ID);
  const url = "https://script.google.com/macros/s/" + ids[0] + "/exec";
  // apiBaseUrl과 timeoutMs 값만 바꾸고 나머지 글자는 그대로 둡니다.
  writeFileSync(CONFIG, text.replace(/(apiBaseUrl\s*:\s*)(["'])[^"']*\2/, (_, key, quote) => key + quote + url + quote).replace(/(timeoutMs\s*:\s*)\d+/, "$115000"));
  console.log("public/config.js에 웹 앱 주소와 timeoutMs 15000을 적었습니다. 이 파일은 저장소에 올리지 않습니다.");
}

function redeploy() {
  const app = webApp(readFileSync(CONFIG, "utf8"));
  if (!app) fail(NO_URL);
  const output = clasp("update-deployment", app.id, "--description", "dashboard");
  if (!output.includes("Redeployed " + app.id + " @")) fail(NO_ID);
  console.log("같은 배포를 새 버전으로 갱신했습니다. 주소는 그대로입니다.");
}

function open() {
  const app = webApp(readFileSync(CONFIG, "utf8"));
  if (!app) fail(NO_URL);
  const target = app.url + "?path=/api/v1/snapshot";
  console.log("브라우저로 엽니다. JSON이 보이면 웹 앱이 동작합니다.");
  console.log(target);
  const opener = process.platform === "win32" ? 'start ""' : process.platform === "darwin" ? "open" : "xdg-open";
  spawnSync(opener + ' "' + target + '"', { shell: true, stdio: "inherit" });
}

const commands = { create, deploy, redeploy, open };
const name = process.argv[2] || "";
if (!Object.hasOwn(commands, name)) fail("사용법: node scripts/gas-clasp.mjs create|deploy|redeploy|open");
commands[name]();
