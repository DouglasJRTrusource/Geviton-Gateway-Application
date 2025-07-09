// trusourcev3/app.js
require("dotenv").config();
const express = require("express");
const socketIo = require("socket.io");
const fs = require("fs").promises;
const path = require("path");
const { startTcpServer, startUdpServer } = require("./servers");
const { GatewayManager } = require("./gateway");
const { MockDataGenerator } = require("./mockDataGenerator");

const app = express();
const server = require("http").createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Logs storage
const logs = [];
const MAX_LOGS = 1000;

function addLog(message) {
  const logEntry = { timestamp: new Date(), message };
  logs.unshift(logEntry);
  if (logs.length > MAX_LOGS) logs.pop();
  io.emit("log", logEntry);
}

// Routes
app.get("/api/devices", async (req, res) => {
  try {
    const devices = JSON.parse(await fs.readFile("devices.json", "utf8"));
    res.json(devices);
  } catch (error) {
    console.error("Error reading devices.json:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/devices", async (req, res) => {
  try {
    const devices = JSON.parse(await fs.readFile("devices.json", "utf8"));
    const newDevice = req.body;
    devices.devices.push(newDevice);
    await fs.writeFile("devices.json", JSON.stringify(devices, null, 2));
    res.json({ success: true });
    addLog(`New device added: ${newDevice.identifier}`);
  } catch (error) {
    console.error("Error writing devices.json:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/templates", async (req, res) => {
  try {
    const templates = JSON.parse(await fs.readFile("templates.json", "utf8"));
    res.json(templates);
  } catch (error) {
    console.error("Error reading templates.json:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/templates", async (req, res) => {
  try {
    const templates = JSON.parse(await fs.readFile("templates.json", "utf8"));
    const newTemplate = req.body;
    templates.templates.push(newTemplate);
    await fs.writeFile("templates.json", JSON.stringify(templates, null, 2));
    res.json({ success: true });
    addLog(`New template added: ${newTemplate.id}`);
  } catch (error) {
    console.error("Error writing templates.json:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/logs", (req, res) => {
  res.json(logs);
});

// Client UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start servers
const gateway = new GatewayManager();
const tcpServer = startTcpServer(process.env.TCP_PORT || 3030, gateway);
const udpServer = startUdpServer(process.env.UDP_PORT || 3050, gateway);

server.listen(process.env.WEB_UI_PORT || 3000, () => {
  console.log(
    `Web admin interface running on port ${process.env.WEB_UI_PORT || 3000}`,
  );
  addLog(
    `Web admin interface started on port ${process.env.WEB_UI_PORT || 3000}`,
  );
});

// WebSocket for real-time updates
io.on("connection", (socket) => {
  console.log("Client connected");
  socket.emit("logs", logs);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start mock data generator
const mockDataGenerator = new MockDataGenerator();
mockDataGenerator.start();

// Forward mock data to WebSocket clients
mockDataGenerator.on("data", (data) => {
  io.emit("data", data);
  addLog(`Data received from ${data.device}`);
});

// Add some initial logs
addLog("IoT Gateway System Started");
addLog("Mock data generation enabled");
addLog("WebSocket server ready");
