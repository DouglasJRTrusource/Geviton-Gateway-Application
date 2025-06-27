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

servers.forEach(startServer);
