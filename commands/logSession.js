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
        .setDescription('Ouvre un formulaire pour enregistrer vos séances.'),
    async execute(interaction) {
        // Créer un modal pour saisir les heures de séance pour chaque jour
        const modal = new ModalBuilder()
            .setCustomId('logsessionModal')
            .setTitle('Planification hebdomadaire');

        // Liste des jours de la semaine
        const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

        // Créer une ActionRow pour chaque jour avec un champ de texte
        const actionRows = days.map(day => {
            const input = new TextInputBuilder()
                .setCustomId(`session_${day.toLowerCase()}`) // ID unique pour chaque jour
                .setLabel(`${day} : Heure de la séance ou "aucune"`)
                .setPlaceholder('HH:MM ou aucune')
                .setStyle(TextInputStyle.Short)
                .setRequired(false); // Rendre chaque champ facultatif

            return new ActionRowBuilder().addComponents(input);
        });

        // Ajouter toutes les ActionRows au modal
        modal.addComponents(...actionRows);

        // Afficher le modal à l'utilisateur
        await interaction.showModal(modal);
    },
};
