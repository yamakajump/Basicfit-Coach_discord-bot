const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

module.exports = {
  async execute(interaction) {
    const dataDir = path.join(__dirname, "../data/basicfit");
    const files = fs.readdirSync(dataDir);

    if (!files.length) {
      return interaction.reply({
        content: `📉 Aucun fichier de données trouvé pour générer les statistiques du serveur.`,
        ephemeral: true,
      });
    }

    let totalSessions = 0;
    let totalUsersWithData = 0;
    const dayCounts = new Array(7).fill(0);
    const monthlyVisits = {};
    const userStats = {};
    const timeCounts = new Array(24).fill(0);

    let totalDaysBetweenVisits = 0;
    let totalVisitPairs = 0;

    files.forEach((file) => {
      const filePath = path.join(dataDir, file);
      try {
        const memberData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const visits = memberData.visits.map((entry) => {
          const [day, month, year] = entry.date.split("-");
          const [hour, minute] = entry.time ? entry.time.split(":") : [0, 0]; // Handle time if available
          return {
            date: new Date(`${year}-${month}-${day}`),
            time: new Date(`${year}-${month}-${day}T${hour}:${minute}`),
          };
        });

        if (visits.length > 0) {
          totalUsersWithData++;
          totalSessions += visits.length;

          // Count visits per day of the week
          visits.forEach(({ date, time }) => {
            const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1; // Adjust for Monday-first
            dayCounts[dayOfWeek]++;

            const hour = time.getHours();
            timeCounts[hour]++;

            // Monthly grouping
            const year = date.getFullYear();
            const month = date.getMonth();
            const monthKey = `${year}-${month}`;
            monthlyVisits[monthKey] = (monthlyVisits[monthKey] || 0) + 1;
          });

          // Calculate average time between visits
          const sortedDates = visits
            .map((v) => v.date.getTime())
            .sort((a, b) => a - b);
          for (let i = 1; i < sortedDates.length; i++) {
            const diffInDays =
              (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);
            totalDaysBetweenVisits += diffInDays;
            totalVisitPairs++;
          }

          // Count visits per user
          const userId = path.basename(file, ".json");
          userStats[userId] = (userStats[userId] || 0) + visits.length;
        }
      } catch (error) {
        console.error(
          `Erreur lors de la lecture du fichier ${file}:`,
          error.message
        );
      }
    });

    // Identifier l'utilisateur avec le plus de séances
    const topUserId = Object.keys(userStats).reduce(
      (a, b) => (userStats[a] > userStats[b] ? a : b),
      null
    );
    const topUserSessions = userStats[topUserId] || 0;

    // Extraire le pseudo depuis l'ID trouvé
    let topUserMention = `Utilisateur inconnu (${topUserId})`;
    const member = interaction.guild.members.cache.get(topUserId);
    if (member) {
      topUserMention = member.displayName; // Utilise le pseudo du serveur s'il existe
    } else {
      topUserMention = `<@${topUserId}>`; // Mentionne l'utilisateur par son ID s'il n'est pas trouvé dans le cache
    }

    // Calculate stats
    const avgSessionsPerUser = (totalSessions / totalUsersWithData).toFixed(2);
    const avgDaysBetweenVisits = totalVisitPairs
      ? (totalDaysBetweenVisits / totalVisitPairs).toFixed(2)
      : "N/A";

    // Find the most active day of the week
    const bestDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
    const bestDayName = [
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
      "Dimanche",
    ][bestDayIndex];
    const totalVisitsOnBestDay = dayCounts[bestDayIndex];

    // Find the most active month
    const bestMonth = Object.entries(monthlyVisits).reduce((best, current) =>
      current[1] > best[1] ? current : best
    );
    const [bestMonthKey, bestMonthCount] = bestMonth;
    const [bestYear, bestMonthIndex] = bestMonthKey.split("-").map(Number);
    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    const bestMonthName = `${monthNames[bestMonthIndex]} ${bestYear}`;

    // Find the most popular time
    const mostPopularHour = timeCounts.indexOf(Math.max(...timeCounts));
    const popularTimeRange = `${mostPopularHour
      .toString()
      .padStart(2, "0")}:00 - ${(mostPopularHour + 1)
      .toString()
      .padStart(2, "0")}:00`;

    // Build the message
    const message = `
📊 **Statistiques globales du serveur** :

👥 **Membres avec données :** ${totalUsersWithData}
🏋️‍♂️ **Total des séances :** ${totalSessions}
📅 **Jour préféré :** ${bestDayName} (${totalVisitsOnBestDay} séances)
🌟 **Top utilisateur :** ${topUserMention} (${topUserSessions} séances)
📊 **Moyenne de séances par utilisateur :** ${avgSessionsPerUser}
⏱️ **Durée moyenne entre visites :** ${avgDaysBetweenVisits} jours
📈 **Meilleur mois :** ${bestMonthName} (${bestMonthCount} séances)
⏰ **Heure la plus populaire :** ${popularTimeRange}
        `;

    await interaction.reply({
      content: message,
    });
  },
};
