const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, REST, Routes, ActivityType } = require('discord.js');
require('dotenv').config();

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
});

// Einstein image URL
const einsteinImage = 'https://upload.wikimedia.org/wikipedia/commons/1/14/Albert_Einstein_1947.jpg';

// Commands
const commands = [
    new SlashCommandBuilder()
        .setName('siggi')
        .setDescription('Get a picture of Albert Einstein'),
    new SlashCommandBuilder()
        .setName('chickensoup')
        .setDescription('Express frustration about packet chicken soup')
];

// Register commands globally when bot starts
async function registerGlobalCommands() {
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        
        console.log('Started refreshing global application (/) commands.');
        
        // Get client ID from token
        const clientId = Buffer.from(process.env.DISCORD_TOKEN.split('.')[0], 'base64').toString();
        
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands.map(command => command.toJSON()) }
        );
        
        console.log('Successfully reloaded global application (/) commands.');
    } catch (error) {
        console.error('Error registering global commands:', error);
    }
}

// When the client is ready
client.once('ready', async () => {
    console.log(`${client.user.tag} has connected to Discord!`);
    console.log(`Bot is in ${client.guilds.cache.size} guilds`);
    
    // Set bot status
    client.user.setActivity('/siggi commands', { type: ActivityType.Listening });
    
    // Register global commands so they work in DMs
    await registerGlobalCommands();
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'siggi') {
        try {
            // Create embed with Einstein image
            const embed = new EmbedBuilder()
                .setTitle('Albert Einstein')
                .setImage(einsteinImage)
                .setColor(0x1f8b4c)
                .setFooter({ text: `Requested by ${interaction.user.displayName}` });

            await interaction.reply({ embeds: [embed] });
            const location = interaction.guild ? interaction.guild.name : 'DM';
            console.log(`Siggi command used by ${interaction.user.tag} in ${location}`);
        } catch (error) {
            console.error('Error in siggi command:', error);
            await interaction.reply({ 
                content: 'Sorry, something went wrong while getting Einstein\'s image!', 
                ephemeral: true 
            });
        }
    } else if (commandName === 'chickensoup') {
        try {
            const message = 'my fucking mother cooks this horrid packet chicken soup SHIT I hate it, it smells so bad and gets everywhere';
            await interaction.reply(message);
            const location = interaction.guild ? interaction.guild.name : 'DM';
            console.log(`Chickensoup command used by ${interaction.user.tag} in ${location}`);
        } catch (error) {
            console.error('Error in chickensoup command:', error);
            await interaction.reply({ 
                content: 'Sorry, something went wrong!', 
                ephemeral: true 
            });
        }
    }
});

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('Failed to login:', error);
});