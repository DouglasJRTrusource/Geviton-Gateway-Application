// trusourcev3/servers.js
const net = require("net");
const dgram = require("dgram");

function startTcpServer(port, gateway) {
  const server = net.createServer((socket) => {
    console.log("TCP client connected");
    socket.on("data", (data) => {
      const message = data.toString();
      console.log("TCP data received:", message);
      // Process the data using the gateway
      const parsedData = gateway.parseData(message, "device-identifier");
      if (parsedData) {
        console.log("Parsed data:", parsedData);
      }
    });
  });

  server.listen(port, () => {
    console.log(`TCP server listening on port ${port}`);
  });
}

function startUdpServer(port, gateway) {
  const server = dgram.createSocket("udp4");

  server.on("message", (msg, rinfo) => {
    console.log(
      `UDP message from ${rinfo.address}:${rinfo.port}:`,
      msg.toString(),
    );
    // Process the data using the gateway
    const parsedData = gateway.parseData(msg.toString(), "device-identifier");
    if (parsedData) {
      console.log("Parsed data:", parsedData);
    }
  });

  server.bind(port, () => {
    console.log(`UDP server listening on port ${port}`);
  });
}

module.exports = { startTcpServer, startUdpServer };
