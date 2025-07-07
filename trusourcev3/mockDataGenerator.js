// trusourcev3/mockDataGenerator.js
const gateway = require("./gateway");
const { GatewayManager } = require("./gateway");

const mockData = [
  {
    identifier: "mock-device-1",
    rawData: '{"data": {"field": 500}}',
  },
  {
    identifier: "mock-device-2",
    rawData: '{"data": {"field": 200}}',
  },
];

function generateMockData(interval) {
  const gatewayManager = new GatewayManager();

  setInterval(() => {
    mockData.forEach((device) => {
      const parsedData = gatewayManager.parseData(
        device.rawData,
        device.identifier,
      );
      if (parsedData) {
        console.log(`Mock data for ${device.identifier}:`, parsedData);
      }
    });
  }, interval);
}

module.exports = { generateMockData };
