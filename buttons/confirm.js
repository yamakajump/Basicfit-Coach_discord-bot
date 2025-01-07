const fs = require('fs');
const path = require('path');

// Fichier pour stocker le classement des séances
const topSeancePath = path.join(__dirname, '../data/topSeance.json');

// Charger ou initialiser les données du classement
function loadTopSeance() {
    if (!fs.existsSync(topSeancePath)) {
        fs.writeFileSync(topSeancePath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(topSeancePath, 'utf8'));
}

function saveTopSeance(data) {
    fs.writeFileSync(topSeancePath, JSON.stringify(data, null, 4));
}

module.exports = {
    async execute(interaction, params) {
        const [userId, day, response] = params;

        if (interaction.user.id !== userId) {
            return interaction.reply({
                content: 'Vous ne pouvez pas confirmer ou annuler les séances d\'un autre utilisateur.',
                ephemeral: true,
            });
        }

        const topSeance = loadTopSeance();

        if (!topSeance[userId]) {
            topSeance[userId] = { yes: 0, no: 0 };
        }

        if (response === 'yes') {
            topSeance[userId].yes += 1;
            await interaction.reply({
                content: '✅ Séance validée. Continue comme ça ! 💪',
                ephemeral: true,
            });
        } else if (response === 'no') {
            topSeance[userId].no += 1;
            await interaction.reply({
                content: '❌ Séance non effectuée. On fera mieux la prochaine fois ! 😊',
                ephemeral: true,
            });
        }

        saveTopSeance(topSeance);
            
        // Supprimer le message où était le bouton et le message de réponse après 30 secondes
        try {
            const originalMessage = await interaction.message.fetch();
            await originalMessage.delete();
        } catch (error) {
            console.error(`Erreur lors de la suppression des messages :`, error);
        }
    },
};
