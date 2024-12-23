const { SlashCommandBuilder } = require('@discordjs/builders');
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Fichier pour stocker les horaires des séances
const dataPath = path.join(__dirname, '../data/sessions.json');

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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logsession')
        .setDescription('Enregistre vos heures de séance pour la semaine.'),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('logsessionModal1')
            .setTitle('Planification : Lundi à Vendredi');

        const weekdays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

        const actionRows = weekdays.map(day => {
            const input = new TextInputBuilder()
                .setCustomId(`session_${day.toLowerCase()}`)
                .setLabel(`${day} : Heure de la séance ou "aucune"`)
                .setPlaceholder('HH:MM ou aucune')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            return new ActionRowBuilder().addComponents(input);
        });

        modal.addComponents(...actionRows);

        await interaction.showModal(modal);
    },
};
