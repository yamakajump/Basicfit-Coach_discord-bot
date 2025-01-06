const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upload')
        .setDescription("Téléverse un fichier JSON contenant vos données Basic-Fit.")
        .addAttachmentOption(option =>
            option.setName('fichier')
                .setDescription('Fichier JSON contenant vos données.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const attachment = interaction.options.getAttachment('fichier');

        if (!attachment || !attachment.name.endsWith('.json')) {
            return interaction.reply({ content: 'Seuls les fichiers JSON sont acceptés.', ephemeral: true });
        }

        try {
            // Télécharge le fichier JSON
            const response = await fetch(attachment.url);
            const jsonData = await response.json();

            // Définit le chemin du dossier ../data/basicfit
            const dataDir = path.join(__dirname, '../data/basicfit/');
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }

            // Définit le chemin complet du fichier à sauvegarder (../data/basicfit/<IdUser>.json)
            const filePath = path.join(dataDir, `${interaction.user.id}.json`);
            fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

            return interaction.reply({ content: 'Données téléchargées avec succès dans ../data/basicfit/ !', ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: `Erreur lors du traitement du fichier : ${error.message}`, ephemeral: true });
        }
    },
};
