const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Afficher différentes statistiques personnelles.'),

    async execute(interaction) {
        // Options proposées
        const statsOptions = [
            { label: 'Heatmap', value: 'heatmap', description: 'Génère une heatmap à la manière de GitHub.' },
            { label: 'Streak Day', value: 'streakDay', description: 'Nombre maximal de jours consécutifs.' },
            { label: 'Streak Week', value: 'streakWeek', description: 'Nombre maximal de semaines consécutives.' },
            { label: 'Average Week', value: 'averageWeek', description: 'Moyenne des jours par semaine.' },
            { label: 'Best Month', value: 'bestMonth', description: 'Mois le plus assidu.' },
            { label: 'Favorite Day', value: 'favoriteDay', description: 'Jour de la semaine préféré.' },
            { label: 'Visits By Day', value: 'visitsByDay', description: 'Graphique des visites par jour.' },
            { label: 'Time Of Day', value: 'timeOfDay', description: 'Périodes d’entraînement préférées.' },
            { label: 'Active Percentage', value: 'activePercentage', description: 'Pourcentage d’activité.' },
            { label: 'Locations', value: 'locations', description: 'Clubs visités et leur fréquence.' },
            { label: 'Avg Time Between Visits', value: 'avgTimeBetweenVisits', description: 'Temps moyen entre deux séances.' },
        ];

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('statsMenu')
                    .setPlaceholder('Choisissez une statistique')
                    .addOptions(statsOptions)
            );

        await interaction.reply({
            content: 'Veuillez sélectionner une statistique à afficher :',
            components: [row],
            ephemeral: true
        });

        const filter = i => i.customId === 'statsMenu' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            const selectedOption = i.values[0];

            try {
                const dataDir = path.join(__dirname, '../../data/basicfit');
                const filePath = path.join(dataDir, `${interaction.user.id}.json`);

                if (!fs.existsSync(filePath)) {
                    return i.reply({ content: "Aucune donnée trouvée. Veuillez téléverser vos données avec `/basicfit upload`.", ephemeral: true });
                }

                const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

                switch (selectedOption) {
                    case 'heatmap':
                        // Ajoutez ici l'implémentation de la heatmap
                        await i.reply({ content: 'Heatmap générée (à implémenter).', ephemeral: true });
                        break;
                    case 'streakDay':
                        // Ajoutez ici l'implémentation du streak day
                        await i.reply({ content: 'Streak Day calculé (à implémenter).', ephemeral: true });
                        break;
                    case 'streakWeek':
                        // Ajoutez ici l'implémentation du streak week
                        await i.reply({ content: 'Streak Week calculé (à implémenter).', ephemeral: true });
                        break;
                    case 'averageWeek':
                        // Ajoutez ici l'implémentation de la moyenne hebdomadaire
                        await i.reply({ content: 'Moyenne hebdomadaire calculée (à implémenter).', ephemeral: true });
                        break;
                    case 'bestMonth':
                        // Ajoutez ici l'implémentation du meilleur mois
                        await i.reply({ content: 'Meilleur mois identifié (à implémenter).', ephemeral: true });
                        break;
                    case 'favoriteDay':
                        // Ajoutez ici l'implémentation du jour préféré
                        await i.reply({ content: 'Jour préféré calculé (à implémenter).', ephemeral: true });
                        break;
                    case 'visitsByDay':
                        // Ajoutez ici l'implémentation des visites par jour
                        await i.reply({ content: 'Visites par jour affichées (à implémenter).', ephemeral: true });
                        break;
                    case 'timeOfDay':
                        // Ajoutez ici l'implémentation des horaires préférés
                        await i.reply({ content: 'Horaires préférés analysés (à implémenter).', ephemeral: true });
                        break;
                    case 'activePercentage':
                        // Ajoutez ici l'implémentation du pourcentage d’activité
                        await i.reply({ content: 'Pourcentage d’activité calculé (à implémenter).', ephemeral: true });
                        break;
                    case 'locations':
                        // Ajoutez ici l'implémentation des clubs visités
                        await i.reply({ content: 'Clubs visités listés (à implémenter).', ephemeral: true });
                        break;
                    case 'avgTimeBetweenVisits':
                        // Ajoutez ici l'implémentation du temps moyen entre visites
                        await i.reply({ content: 'Temps moyen entre visites calculé (à implémenter).', ephemeral: true });
                        break;
                    default:
                        await i.reply({ content: 'Option invalide.', ephemeral: true });
                        break;
                }
            } catch (error) {
                console.error(error);
                await i.reply({ content: `Erreur : ${error.message}`, ephemeral: true });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.followUp({ content: 'Temps écoulé. Veuillez relancer la commande.', ephemeral: true });
            }
        });
    },
};
