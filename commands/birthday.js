const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Fichier pour stocker les anniversaires
const birthdaysFile = path.join(__dirname, '../data/birthdays.json');

// Charger les anniversaires depuis le fichier
let birthdays = {};
if (fs.existsSync(birthdaysFile)) {
    birthdays = JSON.parse(fs.readFileSync(birthdaysFile, 'utf-8'));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription("Enregistre ou affiche les anniversaires.")
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription("Enregistre votre date d'anniversaire.")
                .addStringOption(option =>
                    option.setName('date')
                        .setDescription('Votre date d\'anniversaire au format JJ-MM.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Affiche la liste des anniversaires enregistrés.')
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'set') {
            const date = interaction.options.getString('date');
            const userId = interaction.user.id;

            // Vérifier le format de la date
            if (!/^\d{2}-\d{2}$/.test(date)) {
                return interaction.reply({ content: "Veuillez entrer une date valide au format `JJ-MM`.", ephemeral: true });
            }

            // Enregistrer l'anniversaire
            birthdays[userId] = { username: interaction.user.username, date };
            fs.writeFileSync(birthdaysFile, JSON.stringify(birthdays, null, 4));

            return interaction.reply(`🎉 Votre anniversaire a été enregistré pour le **${date}**.`);
        }

        if (subcommand === 'list') {
            if (Object.keys(birthdays).length === 0) {
                return interaction.reply("📅 Aucun anniversaire n'a été enregistré.");
            }

            const list = Object.values(birthdays)
                .map(entry => `**${entry.username}** : ${entry.date}`)
                .join('\n');

            return interaction.reply(`📅 **Anniversaires enregistrés :**\n\n${list}`);
        }
    },
};
