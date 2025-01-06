const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Afficher différentes statistiques en fonction de vos données.')
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
        ),
    async execute(interaction) {
        const statistique = interaction.options.getString('statistique');

        // Chargement des données JSON de l'utilisateur
        const dataDir = path.join(__dirname, '../../data/basicfit');
        const filePath = path.join(dataDir, `${interaction.user.id}.json`);

        if (!fs.existsSync(filePath)) {
            return interaction.reply({ content: "Aucune donnée trouvée. Veuillez téléverser vos données avec `/basicfit upload`.", ephemeral: true });
        }

        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Logique en fonction de la statistique sélectionnée
        try {
            switch (statistique) {
                case 'heatmap':
                    // Ajoutez ici l'implémentation de la heatmap
                    await interaction.reply({ content: 'Heatmap générée (à implémenter).', ephemeral: true });
                    break;

                case 'streakDay':
                    // Ajoutez ici l'implémentation du streak day
                    await interaction.reply({ content: 'Streak Day calculé (à implémenter).', ephemeral: true });
                    break;

                case 'streakWeek':
                    // Ajoutez ici l'implémentation du streak week
                    await interaction.reply({ content: 'Streak Week calculé (à implémenter).', ephemeral: true });
                    break;

                case 'averageWeek':
                    // Ajoutez ici l'implémentation de la moyenne hebdomadaire
                    await interaction.reply({ content: 'Moyenne hebdomadaire calculée (à implémenter).', ephemeral: true });
                    break;

                case 'bestMonth':
                    // Ajoutez ici l'implémentation du meilleur mois
                    await interaction.reply({ content: 'Meilleur mois identifié (à implémenter).', ephemeral: true });
                    break;

                case 'favoriteDay':
                    // Ajoutez ici l'implémentation du jour préféré
                    await interaction.reply({ content: 'Jour préféré calculé (à implémenter).', ephemeral: true });
                    break;

                case 'visitsByDay':
                    // Ajoutez ici l'implémentation des visites par jour
                    await interaction.reply({ content: 'Visites par jour affichées (à implémenter).', ephemeral: true });
                    break;

                case 'timeOfDay':
                    // Ajoutez ici l'implémentation des horaires préférés
                    await interaction.reply({ content: 'Horaires préférés analysés (à implémenter).', ephemeral: true });
                    break;

                case 'activePercentage':
                    // Ajoutez ici l'implémentation du pourcentage d’activité
                    await interaction.reply({ content: 'Pourcentage d’activité calculé (à implémenter).', ephemeral: true });
                    break;

                case 'locations':
                    // Ajoutez ici l'implémentation des clubs visités
                    await interaction.reply({ content: 'Clubs visités listés (à implémenter).', ephemeral: true });
                    break;

                case 'avgTimeBetweenVisits':
                    // Ajoutez ici l'implémentation du temps moyen entre visites
                    await interaction.reply({ content: 'Temps moyen entre visites calculé (à implémenter).', ephemeral: true });
                    break;

                default:
                    await interaction.reply({ content: 'Option invalide.', ephemeral: true });
                    break;
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `Erreur : ${error.message}`, ephemeral: true });
        }
    },
};
