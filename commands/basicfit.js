const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('basicfit')
        .setDescription('Commandes pour gérer et analyser vos données Basic-Fit.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('upload')
                .setDescription("Téléverse un fichier JSON contenant vos données Basic-Fit.")
                .addAttachmentOption(option =>
                    option.setName('fichier')
                        .setDescription('Fichier JSON contenant vos données.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('stats')
                .setDescription("Afficher différentes statistiques en fonction de vos données.")
                .addStringOption(option =>
                    option.setName('statistique')
                        .setDescription('Choisissez la statistique à afficher.')
                        .addChoices(
                            { name: 'Heatmap', value: 'heatmap' },
                            { name: 'Streak Day', value: 'streakDay' },
                            { name: 'Streak Week', value: 'streakWeek' },
                            { name: 'Average Week', value: 'averageWeek' },
                            { name: 'Best Month', value: 'bestMonth' },
                            { name: 'Favorite Day', value: 'favoriteDay' },
                            { name: 'Visits By Day', value: 'visitsByDay' },
                            { name: 'Time Of Day', value: 'timeOfDay' },
                            { name: 'Active Percentage', value: 'activePercentage' },
                            { name: 'Locations', value: 'locations' },
                            { name: 'Avg Time Between Visits', value: 'avgTimeBetweenVisits' }
                        )
                        .setRequired(true)
                )
                .addUserOption(option =>
                    option.setName('utilisateur')
                        .setDescription("Sélectionnez un utilisateur (par défaut, vous-même).")
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('serverstats')
                .setDescription("Affiche les statistiques globales du serveur BasicFit.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('compare')
                .setDescription("Compare les statistiques entre deux utilisateurs.")
                .addUserOption(option =>
                    option.setName('utilisateur1')
                        .setDescription('Premier utilisateur à comparer.')
                        .setRequired(true)
                )
                .addUserOption(option =>
                    option.setName('utilisateur2')
                        .setDescription('Deuxième utilisateur à comparer.')
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        try {
            // Charger dynamiquement le fichier de la sous-commande
            const subcommandFile = require(`./basicfit/${subcommand}.js`);
            await subcommandFile.execute(interaction);
        } catch (error) {
            console.error(`Erreur lors de l'exécution de la sous-commande ${subcommand}:`, error);
            await interaction.reply({
                content: `Une erreur est survenue lors de l'exécution de la commande \`${subcommand}\`.`,
                ephemeral: true,
            });
        }
    },
};
