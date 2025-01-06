const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Déclaration des jours de la semaine
const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverstats')
        .setDescription('Affiche les statistiques globales du serveur (exemple : total des séances, jour préféré, etc.).'),
    async execute(interaction) {
        const dataDir = path.join(__dirname, '../data/basicfit');
        const allMembers = interaction.guild.members.cache;

        let totalSessions = 0;
        let dayCountsOverall = new Array(7).fill(0); // Pour comptabiliser les visites par jour
        let totalUsersWithData = 0;

        // Boucle à travers tous les membres
        for (const [memberId, member] of allMembers) {
            const filePath = path.join(dataDir, `${memberId}.json`);

            if (!fs.existsSync(filePath)) {
                continue; // Passer les membres sans fichier de données
            }

            totalUsersWithData++;
            const memberData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            const visits = memberData.visits.map(entry => {
                const [day, month, year] = entry.date.split('-');
                return new Date(`${year}-${month}-${day}`);
            });

            // Comptabiliser le total des séances
            totalSessions += visits.length;

            // Comptabiliser les visites par jour de la semaine
            visits.forEach(date => {
                const day = date.getDay(); // Obtenir le jour de la semaine (0 = Dimanche)
                const adjustedDay = (day === 0) ? 6 : day - 1; // Ajuster pour que Lundi soit en premier
                dayCountsOverall[adjustedDay]++;
            });
        }

        // Identifier le jour préféré
        const bestDayIndex = dayCountsOverall.indexOf(Math.max(...dayCountsOverall));
        const bestDay = daysOfWeek[bestDayIndex];
        const totalVisitsOnBestDay = dayCountsOverall[bestDayIndex];

        // Envoyer le message avec les statistiques globales
        await interaction.reply({
            content: `📊 **Statistiques globales du serveur BasicFit** :
            
- 👥 **Membres avec données :** ${totalUsersWithData}
- 🏋️‍♂️ **Total des séances :** ${totalSessions}
- 📅 **Jour préféré :** ${bestDay} (${totalVisitsOnBestDay} séances)`,
            ephemeral: false // Rendre visible à tout le monde
        });
    },
};
