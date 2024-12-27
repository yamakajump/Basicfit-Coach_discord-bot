const cron = require('node-cron'); // Nécessaire pour exécuter des tâches quotidiennes
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
require('dotenv').config();

// Créez une instance du bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// ID du canal pour rapporter les erreurs
const ERROR_CHANNEL_ID = '1320725724994474015';

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

// Charger les anniversaires
const birthdaysFile = path.join(__dirname, 'data/birthdays.json');
let birthdays = {};
if (fs.existsSync(birthdaysFile)) {
    birthdays = JSON.parse(fs.readFileSync(birthdaysFile, 'utf-8'));
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
        console.log('Démarrage de l\'enregistrement des commandes slash.');

        const clientId = '1320700475414151198';
        const guildId = '1308349546648174602';

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );

        console.log('Les commandes slash ont été enregistrées avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des commandes:', error);
        reportError(client, `Erreur lors de l'enregistrement des commandes:\n\`\`\`${error.message}\`\`\``);
    }


// Tâche quotidienne pour vérifier les anniversaires
cron.schedule('0 0 * * *', async () => {
    const today = new Date();
    const todayFormatted = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    const birthdayMembers = Object.values(birthdays).filter(entry => entry.date === todayFormatted);

    for (const member of birthdayMembers) {
        const guild = client.guilds.cache.first(); // Changez pour un serveur spécifique si nécessaire
        const channel = guild.channels.cache.find(ch => ch.name === 'général' || ch.name === 'general');

        if (channel) {
            await channel.send(`🎂 Joyeux anniversaire à **${member.username}** ! 🥳🎉`);
        }
    }
    
})();

global.botStartTime = Date.now();

// Lancer le bot
client.login(process.env.TOKEN);
