const path = require('path');
const fs = require('fs');

// Charger le fichier JSON de configuration
const configPath = path.join(__dirname, '../../data/config.json');
function loadConfig() {
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({ motivationChannels: [] }));
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

        if (!config.motivationChannels || config.motivationChannels.length === 0) {
            return interaction.reply({
                content: 'Aucun salon configuré pour les messages de motivation.',
                ephemeral: true,
            });
        }

        // Supprimer le salon de la liste
        const initialLength = config.motivationChannels.length;
        config.motivationChannels = config.motivationChannels.filter(channel => channel.channelId !== salon.id);

        if (config.motivationChannels.length === initialLength) {
            return interaction.reply({
                content: `Le salon ${salon} n'était pas configuré.`,
                ephemeral: true,
            });
        }

        saveConfig(config);

        await interaction.reply({
            content: `Le salon ${salon} a été supprimé des salons configurés pour les messages de motivation.`,
            ephemeral: true,
        });
    },
};
