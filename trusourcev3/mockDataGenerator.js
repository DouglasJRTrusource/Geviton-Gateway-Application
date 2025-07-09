// trusourcev3/mockDataGenerator.js
const { GatewayManager } = require("./gateway");
const EventEmitter = require("events");

class MockDataGenerator extends EventEmitter {
  constructor() {
    super();
    this.gatewayManager = new GatewayManager();
    this.devices = [
      {
        identifier: "GPS-Tracker-001",
        type: "gps",
        templateId: "gps-template",
        interval: 3000,
      },
      {
        identifier: "Energy-Meter-GEL-001",
        type: "energy",
        templateId: "gel-template",
        interval: 5000,
      },
      {
        identifier: "Energy-Meter-Dani-001",
        type: "energy",
        templateId: "dani-template",
        interval: 7000,
      },
      {
        identifier: "Temp-Sensor-001",
        type: "temperature",
        templateId: "temp-template",
        interval: 4000,
      },
      {
        identifier: "LOG-DEVICE-001",
        type: "logging",
        templateId: "logging-template",
        interval: 2000,
      },
      {
        identifier: "SECURITY-CAM-001",
        type: "security",
        templateId: "security-template",
        interval: 6000,
      },
    ];

    this.logLevels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"];
    this.logSources = ["database", "api", "gateway", "security", "network"];
  }

  generateGPSData() {
    return {
      latitude: (Math.random() * 180 - 90).toFixed(6),
      longitude: (Math.random() * 360 - 180).toFixed(6),
      speed: Math.floor(Math.random() * 120),
      altitude: Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
    };
  }

  generateEnergyData(type) {
    if (type === "gel") {
      return {
        voltage: (220 + Math.random() * 20).toFixed(2),
        current: (Math.random() * 100).toFixed(2),
        power: (Math.random() * 5000).toFixed(2),
        energy: (Math.random() * 1000).toFixed(2),
        frequency: (50 + Math.random() * 5).toFixed(2),
      };
    } else {
      return {
        v_rms: (220 + Math.random() * 20).toFixed(2),
        i_rms: (Math.random() * 100).toFixed(2),
        power_factor: (0.8 + Math.random() * 0.2).toFixed(2),
        energy_consumed: (Math.random() * 1000).toFixed(2),
      };
    }
  }

  generateTemperatureData() {
    return {
      temperature: (20 + Math.random() * 30).toFixed(2),
      humidity: (30 + Math.random() * 40).toFixed(2),
      pressure: (1000 + Math.random() * 50).toFixed(2),
    };
  }

  generateLoggingData() {
    const level =
      this.logLevels[Math.floor(Math.random() * this.logLevels.length)];
    const source =
      this.logSources[Math.floor(Math.random() * this.logSources.length)];

    const messages = {
      DEBUG: [
        "Database connection established",
        "Cache cleared successfully",
        "API endpoint called",
      ],
      INFO: [
        "New device registered",
        "Data synchronization completed",
        "System health check passed",
      ],
      WARNING: [
        "High memory usage detected",
        "Slow query response time",
        "Backup overdue",
      ],
      ERROR: [
        "Database connection timeout",
        "Invalid data format received",
        "Authentication failed",
      ],
      CRITICAL: [
        "System overload",
        "Security breach detected",
        "Power failure",
      ],
    };

    const message =
      messages[level][Math.floor(Math.random() * messages[level].length)];

    return {
      log_level: level,
      message: message,
      timestamp: new Date().toISOString(),
      source: source,
      error_code:
        level === "ERROR" || level === "CRITICAL"
          ? `ERR-${Math.floor(Math.random() * 1000)}`
          : null,
      severity:
        level === "CRITICAL"
          ? 5
          : level === "ERROR"
            ? 4
            : level === "WARNING"
              ? 3
              : level === "INFO"
                ? 2
                : 1,
    };
  }

  generateSecurityData() {
    const motionDetected = Math.random() > 0.7;

    return {
      motion_detected: motionDetected,
      motion_strength: motionDetected ? (Math.random() * 100).toFixed(2) : 0,
      detection_zone: `Zone-${Math.floor(Math.random() * 4) + 1}`,
      recording_duration: motionDetected
        ? Math.floor(Math.random() * 300) + 30
        : 0,
      alert_triggered: motionDetected && Math.random() > 0.8,
      timestamp: new Date().toISOString(),
    };
  }

  generateMockData() {
    this.devices.forEach((device) => {
      setInterval(() => {
        let rawData;

        switch (device.type) {
          case "gps":
            rawData = {
              data: this.generateGPSData(),
              deviceId: device.identifier,
              timestamp: new Date().toISOString(),
            };
            break;
          case "energy":
            rawData = {
              data: this.generateEnergyData(
                device.templateId.includes("gel") ? "gel" : "dani",
              ),
              deviceId: device.identifier,
              timestamp: new Date().toISOString(),
            };
            break;
          case "temperature":
            rawData = {
              data: this.generateTemperatureData(),
              deviceId: device.identifier,
              timestamp: new Date().toISOString(),
            };
            break;
          case "logging":
            rawData = {
              data: this.generateLoggingData(),
              deviceId: device.identifier,
              timestamp: new Date().toISOString(),
            };
            break;
          case "security":
            rawData = {
              data: this.generateSecurityData(),
              deviceId: device.identifier,
              timestamp: new Date().toISOString(),
            };
            break;
        }

        const parsedData = this.gatewayManager.parseData(
          JSON.stringify(rawData),
          device.identifier,
        );

        if (parsedData) {
          this.emit("data", {
            device: device.identifier,
            raw: rawData,
            parsed: parsedData,
            timestamp: new Date(),
          });
        }
      }, device.interval);
    });
  }

  start() {
    console.log("Starting mock data generation...");
    console.log("- GPS Tracker: Every 3 seconds");
    console.log("- GEL Energy Meter: Every 5 seconds");
    console.log("- Dani Energy Meter: Every 7 seconds");
    console.log("- Temperature Sensor: Every 4 seconds");
    console.log("- Logging Device: Every 2 seconds");
    console.log("- Security Camera: Every 6 seconds");
    this.generateMockData();
  }
}

module.exports = { MockDataGenerator };
