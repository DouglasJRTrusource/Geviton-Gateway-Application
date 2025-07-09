// index.js
const { spawn } = require("child_process");
const path = require("path");

const servers = [
  {
    name: "TruSource Gateway",
    script: "trusourcev3/app.js",
    port: 3000,
  },
  {
    name: "Geviton Gateway",
    script: "geviton/server.js",
    port: 3035,
  },
  {
    name: "Geviton Tracker Gateway",
    script: "geviton-tracker/server.js",
    port: 3060,
  },
];

const startServer = (server) => {
  const child = spawn("node", [path.join(__dirname, server.script)]);
  console.log(`Starting ${server.name} on port ${server.port}...`);

  child.stdout.on("data", (data) => {
    console.log(`[${server.name}] ${data.toString().trim()}`);
  });

  child.stderr.on("data", (data) => {
    console.error(`[${server.name}] ${data.toString().trim()}`);
  });

  child.on("close", (code) => {
    console.log(`${server.name} exited with code ${code}`);
  });
};

console.log("Starting Combined Gateway Application...");
console.log("=====================================");
servers.forEach(startServer);

console.log("\nMock Data Generation Status:");
console.log("- GPS Tracker: Every 3 seconds");
console.log("- GEL Energy Meter: Every 5 seconds");
console.log("- Dani Energy Meter: Every 7 seconds");
console.log("- Temperature Sensor: Every 4 seconds");
console.log("\nAccess the web interface at: http://localhost:3000");
