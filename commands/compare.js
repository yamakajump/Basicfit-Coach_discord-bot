const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('compare')
        .setDescription('Compare les statistiques entre deux utilisateurs.')
        .addUserOption(option =>
            option.setName('utilisateur1')
                .setDescription('Premier utilisateur à comparer.')
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('utilisateur2')
                .setDescription('Deuxième utilisateur à comparer.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const utilisateur1 = interaction.options.getUser('utilisateur1');
        const utilisateur2 = interaction.options.getUser('utilisateur2');

        const dataDir = path.join(__dirname, '../data/basicfit');
        const filePath1 = path.join(dataDir, `${utilisateur1.id}.json`);
        const filePath2 = path.join(dataDir, `${utilisateur2.id}.json`);

        if (!fs.existsSync(filePath1) || !fs.existsSync(filePath2)) {
            return interaction.reply({
                content: `Les données de l'un ou des deux utilisateurs sélectionnés sont introuvables. Veuillez vérifier qu'ils ont bien téléversé leurs données avec \`/basicfit upload\`.`,
                ephemeral: true
            });
        }

        const data1 = JSON.parse(fs.readFileSync(filePath1, 'utf-8'));
        const data2 = JSON.parse(fs.readFileSync(filePath2, 'utf-8'));

        // Fonction pour analyser les données utilisateur
        const analyzeUserData = (userData) => {
            const visits = userData.visits.map(entry => {
                const [day, month, year] = entry.date.split('-');
                return new Date(`${year}-${month}-${day}`);
            });
            const totalVisits = visits.length;

            // Jour préféré
            const dayCounts = new Array(7).fill(0);
            const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
            visits.forEach(date => {
                const day = date.getDay();
                dayCounts[day]++;
            });
            const favoriteDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
            const favoriteDay = daysOfWeek[favoriteDayIndex];

            // Mois préféré
            const monthCounts = {};
            visits.forEach(date => {
                const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
                if (!monthCounts[monthKey]) {
                    monthCounts[monthKey] = 0;
                }
                monthCounts[monthKey]++;
            });
            const bestMonth = Object.entries(monthCounts).reduce((best, current) =>
                current[1] > best[1] ? current : best
            );
            const bestMonthName = bestMonth ? `${bestMonth[0]} (${bestMonth[1]} séances)` : "Aucun";

            // Durée moyenne entre visites
            let totalDaysBetweenVisits = 0;
            for (let i = 1; i < visits.length; i++) {
                const diffInTime = visits[i] - visits[i - 1]; // Difference in milliseconds
                const diffInDays = diffInTime / (1000 * 60 * 60 * 24); // Convert to days
                totalDaysBetweenVisits += diffInDays;
            }
            const avgTimeBetweenVisits = visits.length > 1
                ? (totalDaysBetweenVisits / (visits.length - 1)).toFixed(2)
                : "Non applicable";

            // Heure la plus populaire
            const hours = new Array(24).fill(0);
            userData.visits.forEach(entry => {
                const [hour] = entry.time.split(':');
                hours[parseInt(hour)]++;
            });
            const favoriteHourIndex = hours.indexOf(Math.max(...hours));
            const favoriteHour = `${favoriteHourIndex.toString().padStart(2, '0')}:00`;

            // Total de clubs visités
            const clubs = new Set(userData.visits.map(entry => entry.club || "Inconnu"));
            const totalClubs = clubs.size;

            return {
                totalVisits,
                favoriteDay,
                bestMonthName,
                avgTimeBetweenVisits,
                favoriteHour,
                totalClubs
            };
        };

        const stats1 = analyzeUserData(data1);
        const stats2 = analyzeUserData(data2);

        // Comparaison et affichage
        const message = `
📊 **Comparaison des statistiques BasicFit** :

👤 **Utilisateur 1 :** ${utilisateur1.username}
🏋️‍♂️ Total des séances : ${stats1.totalVisits}
📅 Jour préféré : ${stats1.favoriteDay}
📆 Mois préféré : ${stats1.bestMonthName}
⏱️ Durée moyenne entre visites : ${stats1.avgTimeBetweenVisits} jours
⏰ Heure la plus populaire : ${stats1.favoriteHour}
📍 Total de clubs visités : ${stats1.totalClubs}

👤 **Utilisateur 2 :** ${utilisateur2.username}
🏋️‍♂️ Total des séances : ${stats2.totalVisits}
📅 Jour préféré : ${stats2.favoriteDay}
📆 Mois préféré : ${stats2.bestMonthName}
⏱️ Durée moyenne entre visites : ${stats2.avgTimeBetweenVisits} jours
⏰ Heure la plus populaire : ${stats2.favoriteHour}
📍 Total de clubs visités : ${stats2.totalClubs}

🏆 **Le plus actif :** ${
            stats1.totalVisits > stats2.totalVisits
                ? `${utilisateur1.username} avec ${stats1.totalVisits} séances`
                : `${utilisateur2.username} avec ${stats2.totalVisits} séances`
        }
        `;

        await interaction.reply({ content: message });
    },
};
