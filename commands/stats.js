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
                    const imageBuffer = generateHeatmap(jsonData, interaction.member.displayName);
        
                    const attachment = new AttachmentBuilder(imageBuffer, { name: 'heatmap.png' });
        
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
                            content: `\<:coin_info:1321862685578756167> Aucune visite enregistrée pour ${utilisateur.username}.` 
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
                    // Récupérer les visites à partir des données JSON
                    const visitsWeek = jsonData.visits
                        .map(entry => {
                            // Convertir les dates au format standard
                            const [day, month, year] = entry.date.split('-');
                            return new Date(`${year}-${month}-${day}`);
                        })
                        .sort((a, b) => a - b); // Trier par ordre chronologique
                
                    // Vérifier si des visites existent
                    if (!visitsWeek.length) {
                        await interaction.reply({
                            content: `\<:coin_info:1321862685578756167> Aucune visite enregistrée pour ${utilisateur.username}.`
                        });
                        break;
                    }
                
                    // Grouper les visites par semaine (non ISO)
                    const weeks = new Set();
                    visitsWeek.forEach(date => {
                        const year = date.getUTCFullYear();
                        const week = Math.floor((date - new Date(year, 0, 1)) / (1000 * 60 * 60 * 24 * 7)); // Approximation des semaines
                        weeks.add(`${year}-W${week}`);
                    });
                
                    // Calculer le streak maximal de semaines consécutives
                    const sortedWeeks = Array.from(weeks).sort(); // Trier les semaines
                    let maxWeekStreak = 1;
                    let currentWeekStreak = 1;
                
                    for (let i = 1; i < sortedWeeks.length; i++) {
                        const [year1, week1] = sortedWeeks[i - 1].split('-W').map(Number);
                        const [year2, week2] = sortedWeeks[i].split('-W').map(Number);
                
                        // Vérifier si les semaines sont consécutives (gérer le changement d'année)
                        if ((year1 === year2 && week2 === week1 + 1) || (year2 === year1 + 1 && week1 === 51 && week2 === 0)) {
                            currentWeekStreak++;
                            maxWeekStreak = Math.max(maxWeekStreak, currentWeekStreak);
                        } else {
                            currentWeekStreak = 1;
                        }
                    }
                
                    // Envoyer le résultat au canal
                    await interaction.reply({
                        content: `<a:feu:1321793901350223932> **Streak Week** : Le plus grand nombre de semaines consécutives où <@${utilisateur.id}> est allé à la salle est : **${maxWeekStreak} semaines** !`
                    });
                    break;

                case 'averageWeek':
                    // Retrieve visits from JSON data
                    const averageWeekVisits = jsonData.visits
                        .map(entry => {
                            // Convert dates to JavaScript Date objects
                            const [day, month, year] = entry.date.split('-');
                            return new Date(`${year}-${month}-${day}`);
                        });
                
                    if (!averageWeekVisits.length) {
                        await interaction.reply({
                            content: `\<:coin_info:1321862685578756167> Aucune visite enregistrée pour ${utilisateur.username}.`
                        });
                        break;
                    }
                
                    // Group visits by week-year
                    const weeklyVisits = {};
                    averageWeekVisits.forEach(date => {
                        const year = date.getUTCFullYear();
                        const week = Math.floor((date - new Date(year, 0, 1)) / (1000 * 60 * 60 * 24 * 7)); // Approximate week calculation
                        const weekKey = `${year}-W${week}`;
                
                        if (!weeklyVisits[weekKey]) {
                            weeklyVisits[weekKey] = 0;
                        }
                        weeklyVisits[weekKey]++;
                    });
                
                    // Calculate average days per week
                    const totalWeeks = Object.keys(weeklyVisits).length;
                    const totalVisits = Object.values(weeklyVisits).reduce((a, b) => a + b, 0);
                    const averagePerWeek = (totalVisits / totalWeeks).toFixed(2);
                
                    // Send the result to the channel
                    await interaction.reply({
                        content: `\<a:boule:1321847679441178737> **Average Week** : <@${utilisateur.id}> va à la salle en moyenne **${averagePerWeek} jours par semaine** !`
                    });
                    break;
                
                case 'bestMonth':
                    // Retrieve visits from JSON data
                    const visitsMonth = jsonData.visits
                        .map(entry => {
                            // Convert dates to JavaScript Date objects
                            const [day, month, year] = entry.date.split('-');
                            return new Date(`${year}-${month}-${day}`);
                        });
                
                    if (!visitsMonth.length) {
                        await interaction.reply({
                            content: `\<:coin_info:1321862685578756167> Aucune visite enregistrée pour ${utilisateur.username}.`
                        });
                        break;
                    }
                
                    // Group visits by month-year
                    const monthlyVisits = {};
                    visitsMonth.forEach(date => {
                        const month = date.getUTCMonth(); // Months are zero-indexed
                        const year = date.getUTCFullYear();
                        const monthKey = `${year}-${month}`; // Use zero-indexed month
                        if (!monthlyVisits[monthKey]) {
                            monthlyVisits[monthKey] = 0;
                        }
                        monthlyVisits[monthKey]++;
                    });
                
                    // Find the month with the most visits
                    const bestMonth = Object.entries(monthlyVisits).reduce((best, current) =>
                        current[1] > best[1] ? current : best
                    );
                
                    const [bestMonthKey, bestMonthCount] = bestMonth;
                    const [year, monthIndex] = bestMonthKey.split('-').map(Number);
                
                    // Convert zero-indexed month to readable month name
                    const monthNames = [
                        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
                    ];
                    const bestMonthName = `${monthNames[monthIndex]} ${year}`;
                
                    // Send the result to the channel
                    await interaction.reply({
                        content: `\<:coin_info:1321862685578756167> **Best Month** : Le mois où <@${utilisateur.id}> est allé le plus souvent à la salle est : **${bestMonthName}** avec **${bestMonthCount} visites** !`
                    });
                    break;

                case 'favoriteDay':
                    // Retrieve visits from JSON data
                    const visitsDay = jsonData.visits
                        .map(entry => {
                            // Convert dates to JavaScript Date objects
                            const [day, month, year] = entry.date.split('-');
                            return new Date(`${year}-${month}-${day}`);
                        });
                
                    if (!visitsDay.length) {
                        await interaction.reply({
                            content: `\<:coin_info:1321862685578756167> Aucune visite enregistrée pour ${utilisateur.username}.`
                        });
                        break;
                    }
                
                    // Group visits by day of the week
                    const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
                    const dayCounts = new Array(7).fill(0); // Initialize counts for each day
                
                    visitsDay.forEach(date => {
                        const day = date.getDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)
                        dayCounts[day]++;
                    });
                
                    // Find the favorite day
                    const favoriteDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
                    const favoriteDay = daysOfWeek[favoriteDayIndex];
                    const favoriteDayCount = dayCounts[favoriteDayIndex];
                
                    // Send the result to the channel
                    await interaction.reply({
                        content: `\<:info:1322215662621425674> **Favorite Day** : Le jour où <@${utilisateur.id}> va le plus souvent à la salle est : **${favoriteDay}** avec **${favoriteDayCount} visites** !`
                    });
                    break;

                case 'visitsByDay':
                    await interaction.reply({ content: ` (à implémenter).`, ephemeral: true });
                    break;


                case 'timeOfDay':
                    // Retrieve visits from JSON data
                    const visitsTime = jsonData.visits
                        .map(entry => {
                            // Convert dates and times to JavaScript Date objects
                            const [day, month, year] = entry.date.split('-');
                            const [hour, minute] = entry.time.split(':'); // Assumes "time" is available in JSON data
                            return new Date(`${year}-${month}-${day}T${hour}:${minute}`);
                        });
                
                    if (!visitsTime.length) {
                        await interaction.reply({
                            content: `\<:coin_info:1321862685578756167> Aucune visite enregistrée pour ${utilisateur.username}.`
                        });
                        break;
                    }
                
                    // Group visits by hour of the day
                    const hours = new Array(24).fill(0); // Initialize counts for each hour
                    visitsTime.forEach(date => {
                        const hour = date.getHours(); // Get the hour (0-23)
                        hours[hour]++;
                    });
                
                    // Find the preferred time period
                    const maxVisits = Math.max(...hours);
                    const favoriteHours = hours
                        .map((count, index) => (count === maxVisits ? index : null))
                        .filter(hour => hour !== null);
                
                    // Format the result
                    const favoriteTimePeriods = favoriteHours.map(hour => {
                        const start = `${hour.toString().padStart(2, '0')}:00`;
                        const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
                        return `${start} - ${end}`;
                    }).join(', ');
                
                    // Send the result to the channel
                    await interaction.reply({
                        content: `\<a:rveille:1321847935155048530> **Time of Day** : Les horaires préférés de <@${utilisateur.id}> pour aller à la salle sont : **${favoriteTimePeriods}** avec **${maxVisits} visites** durant ces périodes !`
                    });
                    break;


                case 'activePercentage':
                    // Retrieve visits from JSON data
                    const visitsActive = jsonData.visits
                        .map(entry => {
                            // Convert dates to JavaScript Date objects
                            const [day, month, year] = entry.date.split('-');
                            return new Date(`${year}-${month}-${day}`);
                        });
                
                    if (!visitsActive.length) {
                        await interaction.reply({
                            content: `\<:coin_info:1321862685578756167> Aucune visite enregistrée pour ${utilisateur.username}.`
                        });
                        break;
                    }
                
                    // Find the first and last visit dates
                    const sortedVisits = visitsActive.sort((a, b) => a - b); // Sort chronologically
                    const firstVisit = sortedVisits[0];
                    const lastVisit = sortedVisits[sortedVisits.length - 1];
                
                    // Calculate the total period in days
                    const totalDays = Math.ceil((lastVisit - firstVisit) / (1000 * 60 * 60 * 24)) + 1;
                
                    // Count unique active days
                    const uniqueActiveDays = new Set(sortedVisits.map(date => date.toDateString())).size;
                
                    // Calculate the active percentage
                    const activePercentage = ((uniqueActiveDays / totalDays) * 100).toFixed(2);
                
                    // Send the result to the channel
                    await interaction.reply({
                        content: `\<a:cible:1321847819782590464> **Active Percentage** : <@${utilisateur.id}> a été actif **${activePercentage}%** des jours sur la période totale (${uniqueActiveDays} jours actifs sur ${totalDays} jours).`
                    });
                    break;


                case 'locations':
                    // Retrieve visits from JSON data
                    const visitsLocations = jsonData.visits;
                
                    if (!visitsLocations.length) {
                        await interaction.reply({
                            content: `\<:coin_info:1321862685578756167> Aucune visite enregistrée pour ${utilisateur.username}.`
                        });
                        break;
                    }
                
                    // Group visits by club
                    const locationCounts = {};
                    visitsLocations.forEach(entry => {
                        const club = entry.club || "Club inconnu"; // Handle cases where the club field is missing
                        if (!locationCounts[club]) {
                            locationCounts[club] = 0;
                        }
                        locationCounts[club]++;
                    });
                
                    // Format the results into a readable message
                    let message = `📍 **Locations Visited** : Voici la liste des clubs visités par <@${utilisateur.id}> et leur fréquence :\n\n`;
                    Object.entries(locationCounts).forEach(([club, count]) => {
                        message += `- **${club}** : ${count} visite(s)\n`;
                    });
                
                    // Send the result to the channel
                    await interaction.reply({
                        content: message
                    });
                    break;


                case 'avgTimeBetweenVisits':
                    // Retrieve visits from JSON data
                    const avgVisits = jsonData.visits
                        .map(entry => {
                            // Convert dates to JavaScript Date objects
                            const [day, month, year] = entry.date.split('-');
                            return new Date(`${year}-${month}-${day}`);
                        })
                        .sort((a, b) => a - b); // Sort visits chronologically
                
                    if (visits.length < 2) {
                        await interaction.reply({
                            content: `\<:coin_info:1321862685578756167> Pas assez de données pour calculer la moyenne de temps entre les visites pour ${utilisateur.username}.`
                        });
                        break;
                    }
                
                    // Calculate time differences between consecutive visits
                    let totalDaysBetweenVisits = 0;
                    for (let i = 1; i < visits.length; i++) {
                        const diffInTime = visits[i] - visits[i - 1]; // Difference in milliseconds
                        const diffInDays = diffInTime / (1000 * 60 * 60 * 24); // Convert to days
                        totalDaysBetweenVisits += diffInDays;
                    }
                
                    // Calculate average time between visits
                    const avgTimeBetweenVisits = (totalDaysBetweenVisits / (visits.length - 1)).toFixed(2);
                
                    // Send the result to the channel
                    await interaction.reply({
                        content: `\<:info:1322215662621425674> **Average Time Between Visits** : <@${utilisateur.id}> a une moyenne de **${avgTimeBetweenVisits} jours** entre deux séances.`
                    });
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

function generateHeatmap(jsonData, username) {
    const visits = jsonData.visits || [];
    const visitDates = visits.map(visit => new Date(visit.date.split('-').reverse().join('-')));

    const yearData = {};
    visitDates.forEach(date => {
        const year = date.getFullYear();
        const dayOfYear = getDayOfYear(date);
        if (!yearData[year]) yearData[year] = {};
        yearData[year][dayOfYear] = (yearData[year][dayOfYear] || 0) + 1;
    });

    const cellSize = 15;
    const cellGap = 2;
    const padding = 50;
    const titleHeight = 40; // Espace pour le titre
    const fontSize = 12;

    const width = 53 * (cellSize + cellGap) + padding * 2;
    const height = (Object.keys(yearData).length * (7 * (cellSize + cellGap) + 80)) + padding + titleHeight;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Fond global
    ctx.fillStyle = '#2A2A2A';
    ctx.fillRect(0, 0, width, height);

    // Titre
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Visites BasicFit de ${username}`, width / 2, padding - 10);

    let yOffset = padding + titleHeight; // Décalage pour le titre
    Object.keys(yearData).forEach((year, index) => {
        ctx.fillStyle = '#212121'; // Fond gris foncé pour l'année
        ctx.fillRect(padding, yOffset - 30, width - padding * 2, 30);

        ctx.fillStyle = '#FFFFFF'; // Blanc pour le texte de l'année
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(year, width / 2, yOffset - 10);

        drawYearHeatmap(ctx, yearData[year], yOffset, cellSize, cellGap, padding);

        drawMonths(ctx, yOffset, cellSize, cellGap, padding, width); // Ajouter les mois

        yOffset += 7 * (cellSize + cellGap) + 80; // Décalage pour les années
    });

    // Retourner le buffer de l'image
    return canvas.toBuffer('image/png');
}


function drawYearHeatmap(ctx, data, yOffset, cellSize, cellGap, padding) {
    const daysOfWeek = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    ctx.fillStyle = '#FFFFFF'; // Couleur des jours de la semaine
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    daysOfWeek.forEach((day, index) => {
        ctx.fillText(day, padding - 5, yOffset + index * (cellSize + cellGap) + cellSize / 2);
    });

    for (let week = 0; week < 53; week++) {
        for (let day = 0; day < 7; day++) {
            const dayOfYear = week * 7 + day + 1;
            const intensity = data[dayOfYear] || 0;

            // Couleurs selon l'intensité
            if (intensity === 0) {
                ctx.fillStyle = '#212121'; // Case vide
            } else if (intensity === 1) {
                ctx.fillStyle = '#FB7819'; // Clair
            } else {
                ctx.fillStyle = '#FF6500'; // Foncé
            }

            const x = padding + week * (cellSize + cellGap);
            const y = yOffset + day * (cellSize + cellGap);

            ctx.fillRect(x, y, cellSize, cellSize);
        }
    }
}

function drawMonths(ctx, yOffset, cellSize, cellGap, padding, width) {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

    ctx.fillStyle = '#FFFFFF'; // Gris clair pour le texte des mois
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';

    // Position approximative des mois en bas des semaines
    const monthPositions = [0, 4, 8, 13, 17, 21, 26, 30, 35, 39, 43, 48];
    monthPositions.forEach((week, index) => {
        const x = padding + week * (cellSize + cellGap) + (cellSize + cellGap) / 2;
        const y = yOffset + 7 * (cellSize + cellGap) + 15; // En bas des cellules
        ctx.fillText(months[index], x, y);
    });
}

function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}
