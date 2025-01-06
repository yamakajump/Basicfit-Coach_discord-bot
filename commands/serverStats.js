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

        let totalSessions = 0; // Total de toutes les séances
        let dayCountsOverall = new Array(7).fill(0); // Comptes pour chaque jour de la semaine
        let totalUsersWithData = 0; // Nombre de membres avec des fichiers valides

        // Parcourir tous les membres du serveur
        allMembers.forEach((member) => {
            const filePath = path.join(dataDir, `${member.user.id}.json`);

            if (fs.existsSync(filePath)) {
                totalUsersWithData++; // Compter ce membre comme actif

                const memberData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

                // Extraire les visites
                const visits = memberData.visits.map(entry => {
                    const [day, month, year] = entry.date.split('-');
                    return new Date(`${year}-${month}-${day}`);
                });

                // Ajouter au total des séances
                totalSessions += visits.length;

                // Comptabiliser les visites par jour de la semaine
                visits.forEach(date => {
                    const day = date.getDay(); // Obtenir le jour (0 = Dimanche)
                    const adjustedDay = (day === 0) ? 6 : day - 1; // Ajuster pour que Lundi soit en premier
                    dayCountsOverall[adjustedDay]++;
                });
            }
        });

        if (totalUsersWithData === 0) {
            return interaction.reply({
                content: `Aucune donnée trouvée pour les membres de ce serveur. Veuillez demander à vos membres d'uploader leurs fichiers JSON.`,
                ephemeral: true,
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
            ephemeral: false // Visible par tout le monde
        });
    },
};
