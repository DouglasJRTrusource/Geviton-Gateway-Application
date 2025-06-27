# Combined Gateway Application

This is a unified IoT Gateway application that combines three different server components into one easily manageable application.

## Features

### 1. TruSource v3 Gateway (Port 3000, 3030, 3050)
- **Web Admin Interface** (Port 3000): Real-time monitoring and configuration
- **TCP Server** (Port 3030): Handles GPS tracker data with real-time processing
- **UDP Server** (Port 3050): Alternative data ingestion method
- Real-time duplicate detection and data validation
- WebSocket support for live updates
- Template-based data mapping
- Device management system

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

2. **Start all services:**
    npm start

### Port Configuration
| Service          | Port | Protocol | Purpose                    |
| ---------------- | ---- | -------- | -------------------------- |
| TruSource Web UI | 3000 | HTTP     | Web admin interface        |
| TruSource TCP    | 3030 | TCP      | GPS tracker data           |
| TruSource UDP    | 3050 | UDP      | Alternative data input     |
| Geviton Gateway  | 3035 | HTTP     | Energy meter data          |
| Geviton Tracker  | 3060 | HTTP     | Energy meter data (backup) |