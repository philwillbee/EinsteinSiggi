import discord
from discord.ext import commands
import os
import logging
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('bot.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class SiggiBot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        
        super().__init__(
            command_prefix='!',  # Not used for slash commands but required
            intents=intents,
            help_command=None
        )
        
        # Einstein image URLs - using reliable sources
        self.einstein_images = [
            "https://upload.wikimedia.org/wikipedia/commons/1/14/Albert_Einstein_1947.jpg"
        ]

    async def setup_hook(self):
        """This is called when the bot is starting up"""
        try:
            # Sync slash commands
            synced = await self.tree.sync()
            logger.info(f"Synced {len(synced)} command(s)")
        except Exception as e:
            logger.error(f"Failed to sync commands: {e}")

    async def on_ready(self):
        """Called when the bot is ready"""
        logger.info(f'{self.user} has connected to Discord!')
        logger.info(f'Bot is in {len(self.guilds)} guilds')
        
        # Set bot status
        await self.change_presence(
            activity=discord.Activity(
                type=discord.ActivityType.listening,
                name="/siggi commands"
            )
        )

    async def on_command_error(self, ctx, error):
        """Handle command errors"""
        logger.error(f"Command error: {error}")

# Create bot instance
bot = SiggiBot()

@bot.tree.command(name="siggi", description="Get a picture of Albert Einstein")
async def siggi(interaction: discord.Interaction):
    """Slash command that responds with an Einstein image"""
    try:
        # Defer the response to prevent timeout
        await interaction.response.defer()
        
        # Import random here to avoid issues with imports
        import random
        
        # Select a random Einstein image
        image_url = random.choice(bot.einstein_images)
        
        # Create embed with Einstein image
        embed = discord.Embed(
            title="Albert Einstein",
            color=0x1f8b4c
        )
        embed.set_image(url=image_url)
        embed.set_footer(text="Requested by " + interaction.user.display_name)
        
        # Send the response
        await interaction.followup.send(embed=embed)
        
        logger.info(f"Siggi command used by {interaction.user} in {interaction.guild}")
        
    except Exception as e:
        logger.error(f"Error in siggi command: {e}")
        try:
            if interaction.response.is_done():
                await interaction.followup.send(
                    "Sorry, something went wrong while getting Einstein's image! 🤔",
                    ephemeral=True
                )
            else:
                await interaction.response.send_message(
                    "Sorry, something went wrong while getting Einstein's image! 🤔",
                    ephemeral=True
                )
        except:
            logger.error("Failed to send error message to user")

@bot.tree.command(name="chickensoup", description="Express frustration about packet chicken soup")
async def chickensoup(interaction: discord.Interaction):
    """Slash command for chicken soup rant"""
    try:
        message = "my fucking mother cooks this horrid packet chicken soup SHIT I hate it, it smells so bad and gets everywhere"
        await interaction.response.send_message(message)
        
        logger.info(f"Chickensoup command used by {interaction.user} in {interaction.guild}")
        
    except Exception as e:
        logger.error(f"Error in chickensoup command: {e}")
        try:
            await interaction.response.send_message(
                "Sorry, something went wrong!",
                ephemeral=True
            )
        except:
            logger.error("Failed to send error message to user")

async def main():
    """Main function to run the bot"""
    # Get Discord token from environment variables
    token = os.getenv('DISCORD_TOKEN')
    
    if not token:
        logger.error("DISCORD_TOKEN not found in environment variables!")
        logger.error("Please set your Discord bot token in the .env file")
        return
    
    try:
        # Start the bot
        logger.info("Starting bot...")
        await bot.start(token)
    except discord.LoginFailure:
        logger.error("Invalid Discord token provided!")
    except Exception as e:
        logger.error(f"Error starting bot: {e}")
    finally:
        if not bot.is_closed():
            await bot.close()

if __name__ == "__main__":
    try:
        # Run the bot
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Bot stopped by user")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
