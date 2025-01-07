const path = require('path');
const fs = require('fs');

const configPath = path.join(__dirname, '../../data/config.json');
function loadConfig() {
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

function saveConfig(data) {
    fs.writeFileSync(configPath, JSON.stringify(data, null, 4));
}

module.exports = {
    async execute(interaction) {
        const heure = interaction.options.getString('heure');
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

        if (!timeRegex.test(heure)) {
            return interaction.reply({ content: '❌ Format de l\'heure invalide. Utilisez HH:mm.', ephemeral: true });
        }

        const config = loadConfig();
        config.defaultMotivationHour = heure;

        saveConfig(config);

        await interaction.reply({
            content: `Heure par défaut pour la motivation définie à : ${heure}.`,
            ephemeral: true,
        });
    },
};
