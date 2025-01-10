const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Créez une instance du bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Collection des commandes
client.commands = new Collection();
const commands = [];

// Charger toutes les commandes
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// Charger les événements
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Enregistrer les commandes auprès de Discord
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        const clientId = process.env.ID;

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des commandes:', error);
        reportError(client, `Erreur lors de l'enregistrement des commandes:\n\`\`\`${error.message}\`\`\``);
    }
})();

global.botStartTime = Date.now();

// Lancer le bot
client.login(process.env.TOKEN);
