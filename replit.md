# Siggi Bot - Multi-Feature Discord Bot

## Overview

Siggi Bot is a comprehensive Discord bot with multiple entertaining features. The bot includes various slash commands for fun interactions, educational content, and personal memory preservation. Built with Discord.js, it's designed to run continuously with minimal resource usage while providing engaging interactions for Discord servers and DMs.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Bot Framework
- **Discord.js Library**: Uses the modern discord.js library with slash command support
- **Command System**: Implements Discord's native slash commands rather than traditional prefix commands
- **Event-Driven Architecture**: Built on Discord.js's event system with async/await patterns

### Configuration Management
- **Environment Variables**: Uses dotenv for secure token management
- **Logging System**: Console logging for debugging and monitoring
- **JSON Data Loading**: Loads external JSON datasets for enhanced functionality

### Bot Permissions and Intents
- **Message Content Intent**: Enabled for message processing capabilities
- **Required Permissions**: Send Messages, Use Slash Commands, Embed Links for full functionality

### Command Features
- **Einstein Images**: Responds to `/siggi` with Albert Einstein images from Wikimedia Commons
- **Memory Preservation**: `/mallon` command accesses 54,212 authentic Discord messages from a late friend
- **Random Selection**: Various commands implement random selection for variety in responses
- **Multiple Utilities**: Password generation, unit conversion, and other utility functions

### Error Handling and Reliability
- **Basic Error Handling**: Includes try-catch blocks for critical operations like command syncing
- **Continuous Operation**: Designed for 24/7 uptime with minimal resource consumption
- **Graceful Startup**: Implements setup_hook for proper bot initialization and command registration

## External Dependencies

### Core Dependencies
- **discord.js**: Primary Discord API wrapper library for Node.js
- **dotenv**: Environment variable management for secure configuration
- **axios**: HTTP client library for external API requests
- **cheerio**: Server-side jQuery implementation for web scraping
- **figlet**: ASCII art text generation
- **qrcode**: QR code generation functionality

### Discord Integration
- **Discord Developer Portal**: Required for bot token generation and application management
- **Discord API**: Real-time communication with Discord servers through WebSocket connections

### Image Sources
- **Wikimedia Commons**: All Einstein images sourced from reliable, public domain Wikipedia/Wikimedia resources
- **External Image Hosting**: Relies on external URLs for image delivery (potential dependency risk)

### Infrastructure Requirements
- **Node.js Runtime**: Requires Node.js environment with ES6+ support
- **Network Connectivity**: Persistent internet connection required for Discord API communication
- **File System**: Local file system access for JSON data loading and configuration
- **Memory Management**: Efficiently handles large datasets (54k+ messages) in memory