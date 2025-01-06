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
        
        if (!fs.existsSync(dataDir)) {
            return interaction.reply({
                content: `Le répertoire des données n'existe pas. Veuillez vérifier la configuration.`,
                ephemeral: true
            });
        }

        const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
        if (files.length === 0) {
            return interaction.reply({
                content: `Aucune donnée trouvée dans le répertoire. Veuillez uploader des fichiers JSON.`,
                ephemeral: true
            });
        }

        let totalSessions = 0; // Total de toutes les séances
        let dayCountsOverall = new Array(7).fill(0); // Comptes pour chaque jour de la semaine
        let totalUsersWithData = 0; // Nombre de membres avec des fichiers valides

        files.forEach(file => {
            const filePath = path.join(dataDir, file);

            try {
                const memberData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

                // Extraire les visites
                const visits = memberData.visits.map(entry => {
                    const [day, month, year] = entry.date.split('-');
                    return new Date(`${year}-${month}-${day}`);
                });

                if (visits.length > 0) {
                    totalUsersWithData++; // Compter l'utilisateur comme actif
                    totalSessions += visits.length; // Ajouter au total des séances

                    // Comptabiliser les visites par jour de la semaine
                    visits.forEach(date => {
                        const day = date.getDay(); // Obtenir le jour (0 = Dimanche)
                        const adjustedDay = (day === 0) ? 6 : day - 1; // Ajuster pour que Lundi soit en premier
                        dayCountsOverall[adjustedDay]++;
                    });
                }
            } catch (error) {
                console.error(`Erreur lors de la lecture du fichier ${file}:`, error.message);
            }
        });

        if (totalUsersWithData === 0) {
            return interaction.reply({
                content: `Aucune donnée valide trouvée dans les fichiers JSON.`,
                ephemeral: true
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
