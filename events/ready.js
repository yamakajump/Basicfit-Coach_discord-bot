const { scheduleNotifications } = require('./notificationScheduler');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Connecté en tant que ${client.user.tag}`);
        console.log('Le bot est prêt !');

        // envoie un message dans le salon de général à chaque démarrage du bot
        const generalChannel = client.channels.cache.get('1308349548711907360');
        if (generalChannel) {
             generalChannel.send('Je suis de retour mes GymBro !');
        }

        // Planifier les notifications
        scheduleNotifications(client);
    },
};
