const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
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
        .setDescription('Ouvre un formulaire pour enregistrer vos séances.'),
    async execute(interaction) {
        // Créer un modal pour saisir le jour et l'heure
        const modal = new ModalBuilder()
            .setCustomId('logsessionModal')
            .setTitle('Enregistrement de séance');

        // Champ texte pour le jour
        const dayInput = new TextInputBuilder()
            .setCustomId('sessionDay')
            .setLabel('Jour de la semaine (ex : lundi)')
            .setPlaceholder('lundi')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        // Champ texte pour l'heure
        const hourInput = new TextInputBuilder()
            .setCustomId('sessionHour')
            .setLabel('Heure de votre séance ou \"aucune\"')
            .setPlaceholder('18:00 ou aucune')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        // Ajouter les champs au modal
        const rowDay = new ActionRowBuilder().addComponents(dayInput);
        const rowHour = new ActionRowBuilder().addComponents(hourInput);
        modal.addComponents(rowDay, rowHour);

        // Afficher le modal à l'utilisateur
        await interaction.showModal(modal);
    },
};
