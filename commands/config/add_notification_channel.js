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
        const salon = interaction.options.getChannel('salon');

        const config = loadConfig();
        config.notificationChannel = salon.id;

        saveConfig(config);

        await interaction.reply({
            content: `Salon pour les notifications de séances configuré : ${salon}.`,
            ephemeral: true,
        });
    },
};
