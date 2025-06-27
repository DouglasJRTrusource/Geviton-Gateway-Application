// geviton/server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const {
  transformGELData,
  transformDaniMeterData,
  detectDataFormat,
} = require("../trusourcev3/gateway");

const app = express();
const port = 3035;

app.use(express.json());

app.post("/", (req, res) => {
  const rawData = req.body;
  const dataFormat = detectDataFormat(rawData);

  let transformedData;
  if (dataFormat === "gel") {
    transformedData = transformGELData(rawData);
  } else if (dataFormat === "dani") {
    transformedData = transformDaniMeterData(rawData);
  } else {
    return res.status(400).json({ error: "Unknown data format" });
  }

  console.log("Transformed data:", transformedData);

  // Forward the transformed data to the API
  // This is a placeholder for your API forwarding logic
  // const apiResponse = await forwardToAPI(transformedData);

  res.json({ success: true, data: transformedData });
});

app.listen(port, () => {
  console.log(`Geviton Gateway running on port ${port}`);
});
