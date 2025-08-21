# Siggi Bot - Einstein Discord Bot

A simple Discord bot that responds to `/siggi` slash commands with Albert Einstein images.

## Features

- Responds to `/siggi` slash command with Einstein images
- Runs 24/7 continuously
- Minimal resource usage
- Basic error handling and logging
- Random Einstein image selection

## Setup Instructions

### 1. Discord Developer Portal Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name (e.g., "Siggi Bot")
3. Go to the "Bot" section in the left sidebar
4. Click "Add Bot"
5. Under "Token", click "Copy" to copy your bot token
6. Under "Privileged Gateway Intents", enable "Message Content Intent" if needed

### 2. Bot Installation

1. In the Discord Developer Portal, go to "OAuth2" → "URL Generator"
2. Select scopes: `bot` and `applications.commands`
3. Select bot permissions: `Send Messages`, `Use Slash Commands`, `Embed Links`
4. Copy the generated URL and open it in your browser
5. Select the server where you want to add the bot and authorize it

### 3. Local Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Discord bot token:
   ```env
   DISCORD_TOKEN=your_actual_discord_bot_token_here
   ```

3. Install required Python packages:
   ```bash
   pip install discord.py python-dotenv aiohttp
   ```

4. Run the bot:
   ```bash
   python bot.py
   ```

## Usage

Once the bot is running and added to your Discord server:

1. Type `/siggi` in any channel where the bot has permissions
2. The bot will respond with a random Albert Einstein image and quote
3. The bot runs continuously and will respond to the command 24/7

## Bot Permissions Required

- Send Messages
- Use Slash Commands  
- Embed Links
- Read Message History

## Troubleshooting

### Bot not responding to slash commands
- Make sure you've invited the bot with `applications.commands` scope
- Wait a few minutes after adding the bot for slash commands to register
- Check that the bot has proper permissions in the channel

### "DISCORD_TOKEN not found" error
- Make sure you've created a `.env` file (not `.env.example`)
- Verify your bot token is correctly copied from Discord Developer Portal
- Ensure there are no extra spaces in the `.env` file

### Bot goes offline
- Check the console/logs for error messages
- Verify your internet connection is stable
- Ensure your Discord token hasn't been reset

## Logs

The bot creates a `bot.log` file with detailed logging information for monitoring and debugging.

## 24/7 Hosting

For continuous operation, consider hosting on:
- VPS (Virtual Private Server)
- Cloud platforms (AWS, Google Cloud, Azure)
- Raspberry Pi
- Dedicated hosting services

Make sure to:
- Keep the Python process running (use `screen`, `tmux`, or process managers)
- Monitor logs for any issues
- Ensure stable internet connection
- Keep the hosting environment updated

## Support

If you encounter issues:
1. Check the `bot.log` file for error messages
2. Verify all setup steps were completed correctly
3. Ensure your Discord token is valid and hasn't expired
