import http from "node:http";
import fs from "node:fs";
import path from "node:path";

// public 폴더는 명령을 실행한 폴더가 아니라 이 파일이 있는 폴더를 기준으로 찾습니다.
const publicDir = path.resolve(import.meta.dirname, "../public");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png"
};

function send(res, status, type, body) {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(body);
}

function sendNotFound(res) {
  send(res, 404, "text/html; charset=utf-8", fs.readFileSync(path.join(publicDir, "404.html")));
}

const server = http.createServer((req, res) => {
  // 주소의 ? 뒤는 무시하고, 경로를 먼저 풀어서 검사합니다.
  let pathname;
  try {
    pathname = decodeURIComponent(req.url.split("?")[0]);
  } catch {
    sendNotFound(res);
    return;
  }
  if (pathname.startsWith("/api/")) {
    // 이 서버는 API 요청을 대신 전달하지 않습니다.
    send(res, 404, "application/json; charset=utf-8", JSON.stringify({ error: "이 서버는 화면 파일만 보냅니다. 화면은 public/config.js의 apiBaseUrl로 API 서버를 직접 부릅니다." }));
    return;
  }
  const filePath = path.resolve(publicDir, "." + (pathname === "/" ? "/index.html" : pathname));
  // public 밖을 가리키는 주소는 없는 파일과 같게 처리합니다.
  if (!filePath.startsWith(publicDir + path.sep)) {
    sendNotFound(res);
    return;
  }
  fs.readFile(filePath, (error, body) => {
    if (error) {
      sendNotFound(res);
      return;
    }
    send(res, 200, types[path.extname(filePath)] || "text/plain; charset=utf-8", body);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log("http://127.0.0.1:" + server.address().port);
});