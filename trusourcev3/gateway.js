// gateway.js
const fs = require("fs");
const NodeCache = require("node-cache");
const cache = new NodeCache();

class GatewayManager {
  constructor() {
    this.loadData();
    setInterval(() => this.loadData(), 5 * 60 * 1000);
  }

  loadData() {
    try {
      const templatesFile = fs.readFileSync("templates.json", "utf8");
      const devicesFile = fs.readFileSync("devices.json", "utf8");

      console.log("Loading templates:", templatesFile);
      console.log("Loading devices:", devicesFile);

      const templates = JSON.parse(templatesFile);
      const devices = JSON.parse(devicesFile);

      cache.set("templates", templates.templates || []);
      cache.set("devices", devices.devices || []);
    } catch (error) {
      console.error("Error loading data:", error);
      // Initialize empty arrays if files don't exist
      cache.set("templates", []);
      cache.set("devices", []);
    }
  }

  parseData(rawData, identifier) {
    console.log("Parsing data for identifier:", identifier);
    console.log("Raw data:", rawData);

    const devices = cache.get("devices") || [];
    const templates = cache.get("templates") || [];

    console.log("Cached devices:", devices);
    console.log("Cached templates:", templates);

    const device = devices.find((d) => d.identifier === identifier);
    if (!device) {
      console.log("No device found for identifier:", identifier);
      return null;
    }

    const template = templates.find((t) => t.id === device.templateId);
    if (!template) {
      console.log("No template found for device:", device);
      return null;
    }

    let parsedData = { identifier };

    try {
      const data = typeof rawData === "string" ? JSON.parse(rawData) : rawData;

      template.mappings.forEach((mapping) => {
        const value = this.extractValue(data, mapping.source);
        console.log(`Mapping ${mapping.source} to ${mapping.target}:`, value);
        if (value !== undefined) {
          parsedData[mapping.target] = this.transformValue(
            value,
            mapping.transform,
          );
        }
      });

      console.log("Parsed data:", parsedData);
      return parsedData;
    } catch (error) {
      console.error("Parsing error:", error);
      return null;
    }
  }

  extractValue(data, path) {
    return path.split(".").reduce((obj, key) => obj?.[key], data);
  }

  transformValue(value, transform) {
    if (!transform) return value;

    switch (transform.type) {
      case "divide":
        return value / transform.value;
      case "multiply":
        return value * transform.value;
      case "format":
        return transform.format.replace("{}", value);
      default:
        return value;
    }
  }
}

module.exports = { GatewayManager };
