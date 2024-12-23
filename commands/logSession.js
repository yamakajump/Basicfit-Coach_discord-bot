const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
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
        // Créer un modal pour choisir le jour
        const modal = new ModalBuilder()
            .setCustomId('logsessionModal')
            .setTitle('Enregistrement de séance');

        // Ajouter une liste déroulante pour choisir le jour
        const dayInput = new StringSelectMenuBuilder()
            .setCustomId('sessionDay')
            .setPlaceholder('Choisissez un jour')
            .addOptions(
                { label: 'Lundi', value: 'lundi' },
                { label: 'Mardi', value: 'mardi' },
                { label: 'Mercredi', value: 'mercredi' },
                { label: 'Jeudi', value: 'jeudi' },
                { label: 'Vendredi', value: 'vendredi' },
                { label: 'Samedi', value: 'samedi' },
                { label: 'Dimanche', value: 'dimanche' }
            );

        const rowDay = new ActionRowBuilder().addComponents(dayInput);

        // Ajouter un champ texte pour l'heure
        const hourInput = new TextInputBuilder()
            .setCustomId('sessionHour')
            .setLabel('Heure de votre séance ou \"aucune\"')
            .setPlaceholder('18:00 ou aucune')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const rowHour = new ActionRowBuilder().addComponents(hourInput);

        // Ajouter les champs au modal
        modal.addComponents(rowDay, rowHour);

        // Afficher le modal à l'utilisateur
        await interaction.showModal(modal);
    },
};
