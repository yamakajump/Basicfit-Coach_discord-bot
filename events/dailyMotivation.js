const { scheduleJob } = require('node-schedule');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        const dataPath = path.join(__dirname, '../data/motivation.json');
        const motivations = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        const channelId = '1320688827765100565'; // Remplacez par l'ID de votre canal Discord

        // Programmer le message quotidien à 7h
        scheduleJob('0 7 * * *', async () => {
            const channel = client.channels.cache.get(channelId);
            if (!channel) {
                console.error(`Impossible de trouver le canal avec l'ID ${channelId}`);
                return;
            }

            const randomIndex = Math.floor(Math.random() * motivations.citations.length);
            const randomCitation = motivations.citations[randomIndex];
            await channel.send(randomCitation);
        });

        console.log('Message quotidien programmé pour 7h.');
    },
};
