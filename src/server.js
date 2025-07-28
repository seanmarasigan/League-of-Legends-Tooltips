const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
const { spawn } = require("child_process");

// Create HTTP server (to serve index.html)
const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/index.html") {
    const filePath = path.join(__dirname, "index.html");
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Error loading index.html");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

// FIX: Attach WebSocket to existing HTTP server
const wss = new WebSocket.Server({ server }); 

// Spawn Python script
const python = spawn("python", ["src/api.py"]);

let buffer = "";

python.stdout.on("data", (data) => {
  buffer += data.toString();
  const lines = buffer.split("\n");
  buffer = lines.pop();

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const json = JSON.parse(line);
      // Broadcast to all connected clients
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

// Start HTTP server (and attached WebSocket server)
server.listen(3000, () => {
  console.log("Server listening at http://localhost:3000");
});
