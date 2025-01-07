const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { resetNotifications } = require('../events/notificationScheduler');
const fs = require('fs');
const path = require('path');

// Fichier pour stocker les horaires des séances
const dataPath = path.join(__dirname, '../data/sessions.json');

module.exports = {
    async execute(interaction) {
        const userId = interaction.user.id;
        const sessions = loadSessions();

        const weekdays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
        const isValidTime = (input) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(input);

        weekdays.forEach(day => {
            const input = interaction.fields.getTextInputValue(`session_${day}`);
            sessions[userId][day] = input.trim() !== '' ? (isValidTime(input) ? input : null) : null;
        });

        saveSessions(sessions);

         // Répondre avec un bouton pour continuer avec le second modal
         const button = new ButtonBuilder()
         .setCustomId('continueToWeekend')
         .setLabel('Compléter Samedi et Dimanche')
         .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.reply({
            content: 'Vos séances pour Lundi à Vendredi ont été enregistrées. Cliquez sur le bouton ci-dessous pour compléter Samedi et Dimanche.',
            components: [row],
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
