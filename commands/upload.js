// Importation des modules nécessaires
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Configuration du bot
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const PREFIX = '/basicfit';

// Fonction pour charger et sauvegarder les données JSON
async function uploadData(userId, jsonData) {
    try {
        const filePath = path.join(__dirname, `${userId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
        return 'Données téléchargées avec succès !';
    } catch (error) {
        return `Erreur lors de l'upload des données : ${error.message}`;
    }
}

// Événement déclenché lorsqu'un message est envoyé
client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const commandGroup = args.shift();

    if (commandGroup === 'upload') {
        if (!message.attachments.size) {
            return message.reply('Veuillez fournir un fichier JSON à téléverser.');
        }

        const attachment = message.attachments.first();
        if (!attachment.name.endsWith('.json')) {
            return message.reply('Seuls les fichiers JSON sont acceptés.');
        }

        try {
            const response = await fetch(attachment.url);
            const jsonData = await response.json();
            const uploadResponse = uploadData(message.author.id, jsonData);
            return message.reply(uploadResponse);
        } catch (error) {
            return message.reply(`Erreur lors du traitement du fichier : ${error.message}`);
        }
    }

    return message.reply('Commande non reconnue.');
});

// Connexion au bot
client.login('YOUR_BOT_TOKEN');
