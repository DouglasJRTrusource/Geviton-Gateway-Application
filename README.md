# Combined Gateway Application

This is a unified IoT Gateway application that combines three different server components into one easily manageable application.

## Features

### 1. TruSource v3 Gateway (Port 3000, 3030, 3050)

- **Web Admin Interface** (Port 3000): Real-time monitoring and configuration with live data visualization
- **TCP Server** (Port 3030): Handles GPS tracker data with real-time processing
- **UDP Server** (Port 3050): Alternative data ingestion method
- Real-time duplicate detection and data validation
- WebSocket support for live updates
- Template-based data mapping
- Device management system
- **Mock Data Generation**: Automatically generates realistic test data for all device types

### 2. Geviton Energy Meter Gateway (Port 3035)

- Processes GEL (ESP32) and Dani energy meter data
- Transforms data to TruSource format
- Automatic data forwarding to api.v1.trusource.io
- Error logging and failed request retry system
- Daily log file generation

### 3. Geviton Tracker Gateway (Port 3060)

- Similar to Geviton but running on different port
- Handles the same energy meter formats
- Independent logging system
- Redundant processing capability

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **http://localhost:3000**
