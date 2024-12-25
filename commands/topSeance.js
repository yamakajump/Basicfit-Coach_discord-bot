const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

// Fichier contenant le classement des séances
const topSeancePath = path.join(__dirname, '../data/topSeance.json');

// Charger ou initialiser les données du classement
function loadTopSeance() {
    if (!fs.existsSync(topSeancePath)) {
        fs.writeFileSync(topSeancePath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(topSeancePath, 'utf8'));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('topseance')
        .setDescription('Affiche le classement des séances validées et non effectuées.'),
    async execute(interaction) {
        const topSeance = loadTopSeance();

        if (Object.keys(topSeance).length === 0) {
            await interaction.reply({
                content: 'Aucun utilisateur n\'a encore enregistré de séances.',
                ephemeral: true,
            });
            return;
        }

        // Trier les utilisateurs par nombre de séances validées ("Oui")
        const sortedUsers = Object.entries(topSeance)
            .sort(([, a], [, b]) => b.yes - a.yes);

        // Construire le message du classement
        const leaderboard = sortedUsers.map(([userId, stats], index) => {
            return `**#${index + 1}** - <@${userId}> : ✅ **${stats.yes}** séances validées, ❌ **${stats.no}** séances non effectuées`;
        }).join('\n');

        await interaction.reply({
            content: `**Classement des séances :**\n\n${leaderboard}`,
            ephemeral: false,
        });
    },
};
