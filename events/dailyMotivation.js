const { scheduleJob } = require('node-schedule');
const path = require('path');
const { loadJson } = require('../utils/fileManager');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        const dataPath = path.join(__dirname, '../data/motivation.json');
        const configPath = path.join(__dirname, '../data/config.json');

        // Charger les fichiers JSON
        const motivations = loadJson(dataPath, { citations: [] });
        const config = loadJson(configPath, {
            motivationChannels: [],
            defaultMotivationHour: '07:00',
        });

        // Programmer le message quotidien pour chaque configuration
        config.motivationChannels.forEach(({ channelId, ping, userId, customHour }) => {
            const hour = customHour || config.defaultMotivationHour;
            const [hourPart, minutePart] = hour.split(':').map(Number);

            scheduleJob({ hour: hourPart, minute: minutePart }, async () => {
                const channel = client.channels.cache.get(channelId);
                if (!channel) {
                    console.error(`Impossible de trouver le canal avec l'ID ${channelId}`);
                    return;
                }

                const randomIndex = Math.floor(Math.random() * motivations.citations.length);
                const randomCitation = motivations.citations[randomIndex];

                try {
                    // Construire le message avec le ping
                    let pingMessage = '';
                    if (ping === 'user') {
                        pingMessage = `<@${userId}> `;
                    } else if (ping === 'everyone') {
                        pingMessage = '@everyone ';
                    } else if (ping === 'none') {
                        pingMessage = '';
                    }

                    // Envoyer le message
                    await channel.send(`${pingMessage}${randomCitation}`);
                } catch (error) {
                    console.error(`Erreur lors de l'envoi du message dans le canal ${channelId}:`, error);
                }
            });
        });

        console.log('Le bot est prêt et les messages quotidiens ont été programmés !');
    },
};
