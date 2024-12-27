const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription("Pose une question et laisse l'oracle décider de la réponse.")
        .addStringOption(option =>
            option.setName('question')
                .setDescription("La question à poser à l'oracle.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const question = interaction.options.getString('question');

        // Liste des réponses possibles
        const responses = [
            "Oui, absolument !",
            "Non, pas du tout.",
            "Peut-être, qui sait ?",
            "Je ne suis pas sûr, repose ta question plus tard.",
            "Probablement.",
            "Je ne pense pas.",
            "Les signes indiquent que oui.",
            "Cela semble peu probable.",
            "C'est certain.",
            "Demande à nouveau plus tard.",
        ];

        // Sélection d'une réponse aléatoire
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        // Répondre à l'utilisateur
        await interaction.reply(`🎱 **Question :** ${question}\n**Réponse :** ${randomResponse}`);
    },
};
