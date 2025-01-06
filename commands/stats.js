const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
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
                            content: `📉 Aucune visite enregistrée pour ${utilisateur.username}.` 
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
                        content: `<a:feu:1321793901350223932> **Streak Day** : Le plus grand nombre de jours consécutifs où ${utilisateur.username} est allé à la salle est : **${maxStreak} jours** !`
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

    // Préparation des données par année
    const yearData = {};
    visitDates.forEach(date => {
        const year = date.getFullYear();
        const dayOfYear = getDayOfYear(date);
        if (!yearData[year]) yearData[year] = {};
        yearData[year][dayOfYear] = (yearData[year][dayOfYear] || 0) + 1;
    });

    // Configuration générale
    const cellSize = 15;
    const cellGap = 2;
    const padding = 50;
    const fontSize = 12;

    const width = 53 * (cellSize + cellGap) + padding * 2; // 53 semaines
    const height = (Object.keys(yearData).length * (7 * (cellSize + cellGap) + 50)) + padding; // Années empilées

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Fond global
    ctx.fillStyle = '#212121';
    ctx.fillRect(0, 0, width, height);

    // Dessiner chaque année
    let yOffset = padding;
    Object.keys(yearData).forEach((year, index) => {
        // Fond de l'année
        ctx.fillStyle = '#2F2F2F';
        ctx.fillRect(padding, yOffset - 30, width - padding * 2, 30);

        // Texte de l'année
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(year, width / 2, yOffset - 10);

        // Dessiner la heatmap
        drawYearHeatmap(ctx, yearData[year], yOffset, cellSize, cellGap, padding);

        // Décalage pour la prochaine année
        yOffset += 7 * (cellSize + cellGap) + 50;
    });

    // Sauvegarder l'image
    fs.writeFileSync(outputPath, canvas.toBuffer('image/png'));
}

function drawYearHeatmap(ctx, data, yOffset, cellSize, cellGap, padding) {
    const daysOfWeek = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    // Dessiner les jours de la semaine (à droite)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    daysOfWeek.forEach((day, index) => {
        ctx.fillText(day, padding - 5, yOffset + index * (cellSize + cellGap) + cellSize / 2);
    });

    // Dessiner les cellules
    for (let week = 0; week < 53; week++) {
        for (let day = 0; day < 7; day++) {
            const dayOfYear = week * 7 + day + 1;
            const intensity = data[dayOfYear] || 0;

            // Couleurs selon l'intensité
            if (intensity === 0) {
                ctx.fillStyle = '#212121'; // Vide
            } else if (intensity === 1) {
                ctx.fillStyle = '#FB7819'; // Clair
            } else {
                ctx.fillStyle = '#FF6500'; // Foncé
            }

            // Calcul des positions
            const x = padding + week * (cellSize + cellGap);
            const y = yOffset + day * (cellSize + cellGap);

            ctx.fillRect(x, y, cellSize, cellSize);
        }
    }
}

function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}