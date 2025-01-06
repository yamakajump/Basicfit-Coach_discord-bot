const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

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
                    const heatmapPath = path.join(dataDir, `${utilisateur.id}_heatmap.png`);
                    generateHeatmap(jsonData, heatmapPath);
        
                    const attachment = new AttachmentBuilder(heatmapPath, { name: 'heatmap.png' });
        
                    await interaction.reply({
                        content: `Voici la heatmap des visites de ${utilisateur.username} :`,
                        files: [attachment],
                    });
                    break;

                case 'streakDay':
                    const visits = jsonData.visits.map(date => new Date(date).getTime()).sort((a, b) => a - b);
                
                    if (!visits.length) {
                        await interaction.reply({ content: `Aucune visite enregistrée pour ${utilisateur.username}.`, ephemeral: true });
                        break;
                    }
                
                    let maxStreak = 1;
                    let currentStreak = 1;
                
                    for (let i = 1; i < visits.length; i++) {
                        const diffInDays = (visits[i] - visits[i - 1]) / (1000 * 60 * 60 * 24); // Différence en jours
                        if (diffInDays === 1) {
                            currentStreak++;
                            maxStreak = Math.max(maxStreak, currentStreak);
                        } else {
                            currentStreak = 1;
                        }
                    }
                
                    await interaction.reply({
                        content: `Le plus grand nombre de jours consécutifs où ${utilisateur.username} est allé à la salle est : **${maxStreak} jours**.`,
                        ephemeral: true
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

function generateHeatmap(jsonData, outputPath) {
    const visits = jsonData.visits || [];
    const visitDates = visits.map(visit => new Date(visit.date.split('-').reverse().join('-')));

    // Préparation des données pour la heatmap
    const dayCounts = {};
    visitDates.forEach(date => {
        const dayOfYear = getDayOfYear(date);
        dayCounts[dayOfYear] = (dayCounts[dayOfYear] || 0) + 1;
    });

    // Configuration de la heatmap
    const width = 53 * 15; // 53 semaines, 15 pixels par semaine
    const height = 7 * 15; // 7 jours, 15 pixels par jour
    const cellSize = 15;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Couleurs pour les intensités
    const colors = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];

    // Dessiner les cellules
    for (let week = 0; week < 53; week++) {
        for (let day = 0; day < 7; day++) {
            const dayOfYear = week * 7 + day + 1;
            const intensity = dayCounts[dayOfYear] || 0;
            const colorIndex = Math.min(intensity, colors.length - 1);

            ctx.fillStyle = colors[colorIndex];
            ctx.fillRect(week * cellSize, day * cellSize, cellSize, cellSize);
        }
    }

    // Sauvegarder l'image
    fs.writeFileSync(outputPath, canvas.toBuffer('image/png'));
}

function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}