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
        const ping = interaction.options.getString('ping') || 'none';
        const utilisateur = interaction.options.getUser('utilisateur');
        const heure = interaction.options.getString('heure');

        const config = loadConfig();

        // Ajouter une nouvelle configuration au tableau
        config.motivationChannels = config.motivationChannels || [];
        config.motivationChannels.push({
            channelId: salon.id,
            ping,
            userId: ping === 'user' && utilisateur ? utilisateur.id : null,
            customHour: heure || null,
        });

        saveConfig(config);

        await interaction.reply({
            content: `Salon ajouté pour la motivation : ${salon}.\nMention : ${ping}${ping === 'user' ? ` (${utilisateur})` : ''}${heure ? `\nHeure custom : ${heure}` : ''}.`,
            ephemeral: true,
        });
    },
};
