// Commande /topSeance pour le bot Discord
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Chemin vers le fichier des sessions
const sessionsFile = path.join(__dirname, '../data/sessions.json');

// Charger les données des sessions
function loadSessions() {
    if (!fs.existsSync(sessionsFile)) {
        return {};
    }
    return JSON.parse(fs.readFileSync(sessionsFile, 'utf-8'));
}

// Sauvegarder les données des sessions
function saveSessions(data) {
    fs.writeFileSync(sessionsFile, JSON.stringify(data, null, 2));
}

// Commande
module.exports = {
    data: new SlashCommandBuilder()
        .setName('topseance')
        .setDescription('Affiche le classement des utilisateurs par jours de séance'),

    async execute(interaction) {
        const sessions = loadSessions();

        // Générer un classement pour chaque jour
        const leaderboard = {};
        Object.keys(sessions).forEach(userId => {
            Object.keys(sessions[userId]).forEach(day => {
                if (!leaderboard[day]) {
                    leaderboard[day] = [];
                }
                leaderboard[day].push({
                    userId,
                    score: sessions[userId][day]
                });
            });
        });

        // Trier les classements par score décroissant
        for (const day in leaderboard) {
            leaderboard[day].sort((a, b) => b.score - a.score);
        }

        // Générer un embed
        const embed = new MessageEmbed()
            .setTitle('Classement des séances')
            .setColor('#FFA500')
            .setDescription('Voici le classement des utilisateurs par jour.');

        for (const day in leaderboard) {
            const dayLeaderboard = leaderboard[day]
                .map((entry, index) => `#${index + 1} <@${entry.userId}> - **${entry.score} séances**`)
                .join('\n');
            embed.addField(day, dayLeaderboard || 'Aucune donnée', false);
        }

        await interaction.reply({ embeds: [embed] });
    },
};
