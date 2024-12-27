const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription("Joue à Pierre-Feuille-Ciseaux contre le bot.")
        .addStringOption(option =>
            option.setName('choice')
                .setDescription("Votre choix : pierre, feuille ou ciseaux.")
                .setRequired(true)
                .addChoices(
                    { name: 'Pierre', value: 'pierre' },
                    { name: 'Feuille', value: 'feuille' },
                    { name: 'Ciseaux', value: 'ciseaux' }
                )
        ),
    async execute(interaction) {
        // Les choix possibles
        const choices = ['pierre', 'feuille', 'ciseaux'];

        // Récupérer le choix de l'utilisateur
        const userChoice = interaction.options.getString('choice');

        // Choix aléatoire du bot
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        // Déterminer le gagnant
        const result = determineWinner(userChoice, botChoice);

        // Répondre avec les résultats
        await interaction.reply(`🪨📄✂️ **Pierre-Feuille-Ciseaux !**\n\n**Votre choix** : ${userChoice}\n**Choix du bot** : ${botChoice}\n\n**Résultat** : ${result}`);
    },
};

// Fonction pour déterminer le gagnant
function determineWinner(userChoice, botChoice) {
    if (userChoice === botChoice) {
        return "C'est un match nul ! 🤝";
    }

    if (
        (userChoice === 'pierre' && botChoice === 'ciseaux') ||
        (userChoice === 'feuille' && botChoice === 'pierre') ||
        (userChoice === 'ciseaux' && botChoice === 'feuille')
    ) {
        return "Vous avez gagné ! 🎉";
    }

    return "Le bot a gagné ! 😈";
}
