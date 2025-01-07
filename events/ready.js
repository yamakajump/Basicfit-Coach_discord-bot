const { scheduleNotifications } = require('./notificationScheduler');
const { loadJson } = require('../utils/fileManager');
const path = require('path');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Connecté en tant que ${client.user.tag}`);
        console.log('Le bot est prêt !');

        // Charger la configuration
        const configPath = path.join(__dirname, '../data/config.json');
        const config = loadJson(configPath);

        // Vérifier si le message de démarrage est activé
        if (config.startupMessage && config.startupMessage.enabled) {
            const channelId = config.startupMessage.channelId;
            const message = config.startupMessage.message || 'Bot démarré avec succès !';

            if (channelId) {
                const channel = await client.channels.fetch(channelId).catch(() => null);
                if (channel && channel.isTextBased()) {
                    await channel.send(message);
                } else {
                    console.error(`Le salon avec l'ID ${channelId} est introuvable ou non valide.`);
                }
            } else {
                console.error('Aucun salon configuré pour le message de démarrage.');
            }
        }

        // Planifier les notifications
        scheduleNotifications(client);
    },
};
