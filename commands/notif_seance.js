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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('notif_seance')
        .setDescription('Planifiez vos heures de séance hebdomadaires et recevez des rappels personnalisés.'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const sessions = loadSessions();

        // Récupérer les données de l'utilisateur ou utiliser des valeurs par défaut
        const userSessions = sessions[userId] || {};
        const weekdays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

        const modal = new ModalBuilder()
            .setCustomId('logsessionModal1')
            .setTitle('Planification : Lundi à Vendredi');

        // Créer les champs du modal avec les valeurs existantes ou des valeurs par défaut
        const actionRows = weekdays.map(day => {
            const input = new TextInputBuilder()
                .setCustomId(`session_${day.toLowerCase()}`) // ID unique pour chaque jour
                .setLabel(`${day} : Heure de la séance ou "aucune"`)
                .setPlaceholder('HH:MM ou aucune')
                .setValue(userSessions[day.toLowerCase()] || '') // Charger les données existantes ou laisser vide
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            return new ActionRowBuilder().addComponents(input);
        });

        modal.addComponents(...actionRows);

        // Afficher le modal à l'utilisateur
        await interaction.showModal(modal);
    },
};
