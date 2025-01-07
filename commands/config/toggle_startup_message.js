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
        const etat = interaction.options.getBoolean('etat');
        const message = interaction.options.getString('message');
        const salon = interaction.options.getChannel('salon');

        const config = loadConfig();
        config.startupMessage = {
            enabled: etat,
            message: message || config.startupMessage?.message || 'Bot démarré avec succès !',
            channelId: salon ? salon.id : config.startupMessage?.channelId || null,
        };

        saveConfig(config);

        await interaction.reply({
            content: `Message de démarrage ${etat ? 'activé' : 'désactivé'}${etat ? ` dans le salon ${salon || 'défini précédemment'}${message ? ` avec le message : "${message}"` : ''}` : ''}.`,
            ephemeral: true,
        });
    },
};
