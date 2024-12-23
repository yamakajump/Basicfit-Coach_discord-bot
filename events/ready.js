const { scheduleJob } = require('node-schedule');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Connecté en tant que ${client.user.tag}`);
        console.log('Le bot est prêt !');
    },
};
