const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
const { spawn } = require("child_process");

// Serve static files from src/
const STATIC_DIR = __dirname;

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let reqPath = parsedUrl.pathname === "/" ? "/index.html" : parsedUrl.pathname;
  const filePath = path.join(STATIC_DIR, decodeURIComponent(reqPath));

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(`404 Not Found: ${filePath}`);
      res.writeHead(404);
      res.end("Not found");
    } else {
      const ext = path.extname(filePath);
      const contentType = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
      }[ext] || "text/plain";

      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
});

// Attach WebSocket
const wss = new WebSocket.Server({ server });

const pythonPath = path.join(__dirname, "api.py");
const python = spawn("python", [pythonPath]);
console.log("✅ Spawned Python process:", pythonPath);

let buffer = "";

python.stdout.on("data", (data) => {
  buffer += data.toString();
  const lines = buffer.split("\n");
  buffer = lines.pop();

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const json = JSON.parse(line);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(json));
        }
      });
    } catch (err) {
      console.error("❌ JSON parse error:", err.message);
    }
  }
});

python.stderr.on("data", (data) => {
  console.error("Python error:", data.toString());
});

python.on("close", (code) => {
  console.log(`Python script exited with code ${code}`);
});

server.listen(8080, () => {
  console.log("Server listening at http://localhost:8080");
});
