# Siggi Bot - Einstein Discord Bot

## Overview

Siggi Bot is a simple Discord bot that responds to `/siggi` slash commands with random Albert Einstein images. The bot is designed to run continuously with minimal resource usage, providing a fun and educational interaction for Discord servers. It uses the Discord.py library to handle bot functionality and implements slash commands for modern Discord interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Bot Framework
- **Discord.py Library**: Uses the modern discord.py library with slash command support
- **Command System**: Implements Discord's native slash commands rather than traditional prefix commands
- **Event-Driven Architecture**: Built on Discord.py's event system with async/await patterns

### Configuration Management
- **Environment Variables**: Uses python-dotenv for secure token management
- **Logging System**: Dual logging to both file (`bot.log`) and console for debugging and monitoring

### Bot Permissions and Intents
- **Message Content Intent**: Enabled for message processing capabilities
- **Required Permissions**: Send Messages, Use Slash Commands, Embed Links for full functionality

### Image Management
- **Static Image Pool**: Maintains a hardcoded list of reliable Einstein image URLs from Wikimedia Commons
- **Random Selection**: Implements random image selection for variety in responses

### Error Handling and Reliability
- **Basic Error Handling**: Includes try-catch blocks for critical operations like command syncing
- **Continuous Operation**: Designed for 24/7 uptime with minimal resource consumption
- **Graceful Startup**: Implements setup_hook for proper bot initialization and command registration

## External Dependencies

### Core Dependencies
- **discord.py**: Primary Discord API wrapper library
- **python-dotenv**: Environment variable management for secure configuration
- **aiohttp**: HTTP client library (dependency of discord.py for async operations)

### Discord Integration
- **Discord Developer Portal**: Required for bot token generation and application management
- **Discord API**: Real-time communication with Discord servers through WebSocket connections

### Image Sources
- **Wikimedia Commons**: All Einstein images sourced from reliable, public domain Wikipedia/Wikimedia resources
- **External Image Hosting**: Relies on external URLs for image delivery (potential dependency risk)

### Infrastructure Requirements
- **Python Runtime**: Requires Python environment with async/await support
- **Network Connectivity**: Persistent internet connection required for Discord API communication
- **File System**: Local file system access for logging capabilities