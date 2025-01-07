const { resetNotifications } = require('../events/notificationScheduler');
const fs = require('fs');
const path = require('path');

// Fichier pour stocker les horaires des séances
const dataPath = path.join(__dirname, '../data/sessions.json');

module.exports = {
    async execute(interaction) {
        const userId = interaction.user.id;
        const sessions = loadSessions();

        const weekend = ['samedi', 'dimanche'];
        const isValidTime = (input) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(input);

        weekend.forEach(day => {
            const input = interaction.fields.getTextInputValue(`session_${day}`);
            sessions[userId][day] = input.trim() !== '' ? (isValidTime(input) ? input : null) : null;
        });

        saveSessions(sessions);

        await interaction.reply({
            content: 'Vos séances pour Samedi et Dimanche ont été enregistrées. Merci !',
            ephemeral: true,
        });

        resetNotifications(interaction.client);
    },
};

// Charger ou initialiser les données des séances
function loadSessions() {
    if (!fs.existsSync(dataPath)) {
        fs.writeFileSync(dataPath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveSessions(sessions) {
    fs.writeFileSync(dataPath, JSON.stringify(sessions, null, 4));
}