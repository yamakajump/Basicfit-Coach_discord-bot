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
        )
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription("Sélectionnez un utilisateur (par défaut, vous-même).")
                .setRequired(false)
        ),
    async execute(interaction) {
        const statistique = interaction.options.getString('statistique');
        const utilisateur = interaction.options.getUser('utilisateur') || interaction.user; // Utilise l'utilisateur mentionné ou celui qui exécute la commande

        // Chargement des données JSON de l'utilisateur
        const dataDir = path.join(__dirname, '../data/basicfit');
        const filePath = path.join(dataDir, `${utilisateur.id}.json`);

        if (!fs.existsSync(filePath)) {
            return interaction.reply({ content: `Aucune donnée trouvée pour ${utilisateur.username}. Veuillez téléverser les données avec \`/basicfit upload\`.`, ephemeral: true });
        }

        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Logique en fonction de la statistique sélectionnée
        try {
            switch (statistique) {
                case 'heatmap':
                    await interaction.reply({ content: `Heatmap générée pour ${utilisateur.username} (à implémenter).`, ephemeral: true });
                    break;

                case 'streakDay':
                    // Récupérer les visites à partir des données JSON
                    const visits = jsonData.visits
                        .map(entry => {
                            // Convertir les dates au format standard
                            const [day, month, year] = entry.date.split('-');
                            return new Date(`${year}-${month}-${day}`).getTime();
                        })
                        .sort((a, b) => a - b); // Trier par ordre chronologique
                
                    // Vérifier si des visites existent
                    if (!visits.length) {
                        await interaction.reply({ 
                            content: `Aucune visite enregistrée pour ${utilisateur.username}.` 
                        });
                        break;
                    }
                
                    // Initialisation des variables pour calculer les streaks
                    let maxStreak = 1;
                    let currentStreak = 1;
                
                    // Parcourir les visites pour calculer le streak maximal
                    for (let i = 1; i < visits.length; i++) {
                        const diffInDays = (visits[i] - visits[i - 1]) / (1000 * 60 * 60 * 24); // Différence en jours
                        if (diffInDays === 1) {
                            currentStreak++;
                            maxStreak = Math.max(maxStreak, currentStreak);
                        } else if (diffInDays > 1) {
                            currentStreak = 1;
                        }
                    }
                
                    // Envoyer le résultat au canal
                    await interaction.reply({
                        content: `🏋️ **Streak Day** : Le plus grand nombre de jours consécutifs où ${utilisateur.username} est allé à la salle est : **${maxStreak} jours** !`
                    });
                    break;

                case 'streakWeek':
                    await interaction.reply({ content: `Streak Week calculé pour ${utilisateur.username} (à implémenter).`, ephemeral: true });
                    break;

                case 'averageWeek':
                    await interaction.reply({ content: `Moyenne hebdomadaire calculée pour ${utilisateur.username} (à implémenter).`, ephemeral: true });
                    break;

                case 'bestMonth':
                    await interaction.reply({ content: `Meilleur mois identifié pour ${utilisateur.username} (à implémenter).`, ephemeral: true });
                    break;

                case 'favoriteDay':
                    await interaction.reply({ content: `Jour préféré calculé pour ${utilisateur.username} (à implémenter).`, ephemeral: true });
                    break;

                case 'visitsByDay':
                    await interaction.reply({ content: `Visites par jour affichées pour ${utilisateur.username} (à implémenter).`, ephemeral: true });
                    break;

                case 'timeOfDay':
                    await interaction.reply({ content: `Horaires préférés analysés pour ${utilisateur.username} (à implémenter).`, ephemeral: true });
                    break;

                case 'activePercentage':
                    await interaction.reply({ content: `Pourcentage d’activité calculé pour ${utilisateur.username} (à implémenter).`, ephemeral: true });
                    break;

                case 'locations':
                    await interaction.reply({ content: `Clubs visités listés pour ${utilisateur.username} (à implémenter).`, ephemeral: true });
                    break;

                case 'avgTimeBetweenVisits':
                    await interaction.reply({ content: `Temps moyen entre visites calculé pour ${utilisateur.username} (à implémenter).`, ephemeral: true });
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
