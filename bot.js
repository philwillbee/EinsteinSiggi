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

// List of vegan recipe search terms
const veganRecipeTerms = [
    'vegan pasta', 'vegan curry', 'vegan stir fry', 'vegan soup', 'vegan salad',
    'vegan pizza', 'vegan burger', 'vegan tacos', 'vegan smoothie bowl', 'vegan sandwich',
    'vegan quinoa', 'vegan lentil', 'vegan chickpea', 'vegan rice bowl', 'vegan noodles',
    'vegan Buddha bowl', 'vegan wrap', 'vegan chili', 'vegan pancakes', 'vegan oatmeal',
    'vegan tofu', 'vegan tempeh', 'vegan mushroom', 'vegan avocado', 'vegan sweet potato',
    'vegan black bean', 'vegan hummus', 'vegan ramen', 'vegan pad thai', 'vegan risotto'
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

// Function to get random vegan recipe
async function getRandomVeganRecipe() {
    try {
        const randomTerm = veganRecipeTerms[Math.floor(Math.random() * veganRecipeTerms.length)];
        
        // Use Edamam Recipe API (free tier)
        const appId = '3b9d2a85'; // Public demo app ID
        const appKey = '88cdb7a4b4a6d5b5b5c40ebdc158ead7'; // Public demo key
        
        const searchUrl = `https://api.edamam.com/search?q=${encodeURIComponent(randomTerm)}&app_id=${appId}&app_key=${appKey}&health=vegan&to=10`;
        
        const response = await axios.get(searchUrl);
        const recipes = response.data.hits;
        
        if (recipes && recipes.length > 0) {
            const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)].recipe;
            
            // Format ingredients list
            const ingredients = randomRecipe.ingredientLines.slice(0, 8).join('\n• ');
            
            return {
                name: randomRecipe.label,
                image: randomRecipe.image,
                ingredients: ingredients,
                calories: Math.round(randomRecipe.calories / randomRecipe.yield),
                servings: randomRecipe.yield,
                url: randomRecipe.url,
                source: randomRecipe.source
            };
        } else {
            throw new Error('No recipes found');
        }
    } catch (error) {
        console.error('Error fetching recipe data:', error);
        
        // Fallback with curated vegan recipes
        const fallbackRecipes = [
            {
                name: 'Creamy Vegan Pasta',
                ingredients: '• 300g pasta\n• 1 cup cashews\n• 2 cloves garlic\n• 1 cup vegetable broth\n• 2 tbsp nutritional yeast\n• Salt and pepper\n• Fresh herbs',
                calories: 450,
                servings: 4,
                image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=500',
                url: 'https://example.com/vegan-pasta',
                source: 'Vegan Recipe Collection'
            },
            {
                name: 'Chickpea Buddha Bowl',
                ingredients: '• 1 cup quinoa\n• 1 can chickpeas\n• 2 cups vegetables\n• 1 avocado\n• Tahini dressing\n• Seeds and nuts',
                calories: 520,
                servings: 2,
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
                url: 'https://example.com/buddha-bowl',
                source: 'Healthy Vegan Meals'
            },
            {
                name: 'Lentil Coconut Curry',
                ingredients: '• 1 cup red lentils\n• 1 can coconut milk\n• 2 cups vegetables\n• Curry spices\n• Ginger and garlic\n• Fresh cilantro',
                calories: 380,
                servings: 4,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500',
                url: 'https://example.com/lentil-curry',
                source: 'Plant-Based Kitchen'
            }
        ];
        
        return fallbackRecipes[Math.floor(Math.random() * fallbackRecipes.length)];
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
    },
    {
        name: 'vegan',
        description: 'Get a random vegan recipe with picture',
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
    } else if (commandName === 'vegan') {
        try {
            // Defer the response for longer processing time
            await interaction.deferReply();
            
            // Get random vegan recipe data
            const recipe = await getRandomVeganRecipe();
            
            // Create embed with recipe info
            const embed = new EmbedBuilder()
                .setTitle(`🌱 ${recipe.name}`)
                .setDescription(recipe.ingredients)
                .setColor(0x00b894)
                .addFields(
                    { name: '👥 Servings', value: recipe.servings.toString(), inline: true },
                    { name: '🔥 Calories', value: `${recipe.calories} per serving`, inline: true },
                    { name: '📚 Source', value: recipe.source, inline: true }
                )
                .setFooter({ text: `Requested by ${interaction.user.displayName} • Vegan Recipe` });
            
            // Add image if available
            if (recipe.image) {
                embed.setImage(recipe.image);
            }
            
            // Add URL if available
            if (recipe.url && !recipe.url.includes('example.com')) {
                embed.setURL(recipe.url);
            }
            
            await interaction.editReply({ embeds: [embed] });
            
            const location = interaction.guild ? interaction.guild.name : 'DM';
            console.log(`Vegan command used by ${interaction.user.tag} in ${location} - Got: ${recipe.name}`);
            
        } catch (error) {
            console.error('Error in vegan command:', error);
            try {
                await interaction.editReply({
                    content: 'Sorry, something went wrong while getting vegan recipe information!',
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