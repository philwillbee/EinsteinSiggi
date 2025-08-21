const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, REST, Routes, ActivityType, Partials } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [
        Partials.Channel,
        Partials.Message
    ]
});

// Einstein image URL
const einsteinImage = 'https://upload.wikimedia.org/wikipedia/commons/1/14/Albert_Einstein_1947.jpg';

// List of famous scientists for random selection
const scientists = [
    'Isaac Newton', 'Albert Einstein', 'Charles Darwin', 'Marie Curie', 'Galileo Galilei',
    'Nikola Tesla', 'Stephen Hawking', 'Richard Feynman', 'Rosalind Franklin', 'Alexander Fleming',
    'Louis Pasteur', 'Gregor Mendel', 'Alan Turing', 'Ada Lovelace', 'Katherine Johnson',
    'Neil deGrasse Tyson', 'Carl Sagan', 'Rachel Carson', 'Dorothy Hodgkin', 'Barbara McClintock',
    'Lise Meitner', 'Chien-Shiung Wu', 'Hedy Lamarr', 'Mae Jemison', 'George Washington Carver',
    'Benjamin Franklin', 'Michael Faraday', 'James Watson', 'Francis Crick', 'Erwin Schrödinger',
    'Max Planck', 'Niels Bohr', 'Werner Heisenberg', 'Ernest Rutherford', 'Johannes Kepler',
    'Copernicus', 'Leonardo da Vinci', 'Archimedes', 'Aristotle', 'Plato'
];

// Function to get random scientist info from Wikipedia
async function getRandomScientist() {
    try {
        const randomScientist = scientists[Math.floor(Math.random() * scientists.length)];
        const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(randomScientist)}`;
        
        const response = await axios.get(searchUrl);
        const data = response.data;
        
        // Get the main image URL if available
        let imageUrl = data.thumbnail ? data.thumbnail.source : null;
        if (imageUrl && imageUrl.includes('thumb/')) {
            // Get higher resolution image by removing thumb sizing
            imageUrl = imageUrl.replace(/\/thumb\//, '/').replace(/\/\d+px-.*$/, '');
        }
        
        return {
            name: data.title,
            description: data.extract || 'No description available.',
            image: imageUrl,
            url: data.content_urls.desktop.page
        };
    } catch (error) {
        console.error('Error fetching scientist data:', error);
        // Fallback to a basic response
        const randomScientist = scientists[Math.floor(Math.random() * scientists.length)];
        return {
            name: randomScientist,
            description: 'A brilliant scientist who made significant contributions to their field.',
            image: null,
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(randomScientist)}`
        };
    }
}

// Commands with DM integration support
const commands = [
    {
        name: 'siggi',
        description: 'Get a picture of Albert Einstein',
        integration_types: [0, 1], // 0 = guild, 1 = user (DMs)
        contexts: [0, 1, 2] // 0 = guild, 1 = bot DM, 2 = private channel
    },
    {
        name: 'chickensoup',
        description: 'Express frustration about packet chicken soup',
        integration_types: [0, 1], // 0 = guild, 1 = user (DMs)
        contexts: [0, 1, 2] // 0 = guild, 1 = bot DM, 2 = private channel
    },
    {
        name: 'scientist',
        description: 'Get information about a random scientist',
        integration_types: [0, 1], // 0 = guild, 1 = user (DMs)
        contexts: [0, 1, 2] // 0 = guild, 1 = bot DM, 2 = private channel
    }
];

// Register commands globally when bot starts
async function registerGlobalCommands() {
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        
        console.log('Started refreshing global application (/) commands.');
        
        // Get client ID from the logged in client
        const clientId = client.user.id;
        
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
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
    } else if (commandName === 'scientist') {
        try {
            // Defer the response for longer processing time
            await interaction.deferReply();
            
            // Get random scientist data
            const scientist = await getRandomScientist();
            
            // Create embed with scientist info
            const embed = new EmbedBuilder()
                .setTitle(scientist.name)
                .setDescription(scientist.description)
                .setColor(0x0099ff)
                .setURL(scientist.url)
                .setFooter({ text: `Requested by ${interaction.user.displayName} • Source: Wikipedia` });
            
            // Add image if available
            if (scientist.image) {
                embed.setImage(scientist.image);
            }
            
            await interaction.editReply({ embeds: [embed] });
            
            const location = interaction.guild ? interaction.guild.name : 'DM';
            console.log(`Scientist command used by ${interaction.user.tag} in ${location} - Got: ${scientist.name}`);
            
        } catch (error) {
            console.error('Error in scientist command:', error);
            try {
                await interaction.editReply({
                    content: 'Sorry, something went wrong while getting scientist information!',
                });
            } catch {
                console.error('Failed to send error message to user');
            }
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