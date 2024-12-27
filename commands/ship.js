const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch'); // Nécessaire pour obtenir des GIFs depuis une API

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription("Associe deux utilisateurs pour créer un ship.")
        .addUserOption(option =>
            option.setName('user1')
                .setDescription("Le premier utilisateur du ship.")
                .setRequired(false)
        )
        .addUserOption(option =>
            option.setName('user2')
                .setDescription("Le second utilisateur du ship.")
                .setRequired(false)
        ),
    async execute(interaction) {
        // Récupérer les utilisateurs
        const user1 = interaction.options.getUser('user1') || getRandomMember(interaction.guild);
        const user2 = interaction.options.getUser('user2') || getRandomMember(interaction.guild, user1);

        if (!user1 || !user2) {
            return interaction.reply({ content: "Pas assez de membres pour créer un ship !", ephemeral: true });
        }

        // Générer un nom de ship
        const shipName = generateShipName(user1.username, user2.username);

        // Générer un pourcentage de compatibilité
        const compatibility = Math.floor(Math.random() * 101);

        // Obtenir un GIF romantique
        const gifUrl = await getRomanticGif();

        // Répondre avec le résultat
        await interaction.reply({
            content: `💞 **Nouveau ship détecté !** 💞\n\n🌟 **${user1.username}** ❤️ **${user2.username}**\n✨ **Nom du ship** : ${shipName}\n🎯 **Compatibilité** : ${compatibility}% ! 💕\n${gifUrl}`,
        });
    },
};

// Fonction pour obtenir un membre aléatoire
function getRandomMember(guild, excludeUser = null) {
    const members = guild.members.cache
        .filter(member => !member.user.bot && member.user !== excludeUser)
        .map(member => member.user);
    return members.length > 0 ? members[Math.floor(Math.random() * members.length)] : null;
}

// Fonction pour générer un nom de ship
function generateShipName(name1, name2) {
    const half1 = name1.slice(0, Math.ceil(name1.length / 2));
    const half2 = name2.slice(Math.floor(name2.length / 2));
    return half1 + half2;
}

// Fonction pour obtenir un GIF romantique depuis Tenor
async function getRomanticGif() {
    const apiKey = 'TENOR_API_KEY'; // Remplacez par votre clé API Tenor
    const url = `https://g.tenor.com/v1/search?q=romantic&key=${apiKey}&limit=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results.length > 0 ? data.results[0].url : "Pas de GIF disponible pour le moment.";
    } catch (error) {
        console.error("Erreur lors de la récupération du GIF :", error);
        return "Erreur lors de la récupération du GIF.";
    }
}
