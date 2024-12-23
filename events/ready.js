module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Connecté en tant que ${client.user.tag}`);
        console.log('Le bot est prêt !');
    },
};
