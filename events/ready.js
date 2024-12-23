const { scheduleJob } = require('node-schedule');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Connecté en tant que ${client.user.tag}`);
        console.log('Le bot est prêt !');

        const dataPath = path.join(__dirname, '../data/motivation.json');
        const motivations = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        // Mapping des utilisateurs et leurs salons
        const userChannels = [
            { userId: '634433284285268006', channelId: '1320740603486539835' }, // Tristan
            { userId: '690488124480028692', channelId: '1320741324256968786' }, // Corentin
            { userId: '829613924391059476', channelId: '1320741423032832050' }, // Nathan
            { userId: '396373256053194752', channelId: '1320741448630534175' }, // Rémy
            { userId: '430759169407320087', channelId: '1320741501768044575' }, // Axel
        ];

        // Programmer le message quotidien à 7h
        scheduleJob('46 13 * * *', async () => {
            for (const { userId, channelId } of userChannels) {
                const channel = client.channels.cache.get(channelId);
                if (!channel) {
                    console.error(`Impossible de trouver le canal avec l'ID ${channelId}`);
                    continue;
                }

                const randomIndex = Math.floor(Math.random() * motivations.citations.length);
                const randomCitation = motivations.citations[randomIndex];

                try {
                    await channel.send(`<@${userId}> ${randomCitation}`);
                } catch (error) {
                    console.error(`Erreur lors de l'envoi du message dans le canal ${channelId}:`, error);
                }
            }
        });

        console.log('Messages quotidiens programmés pour 7h.');
    },
};
