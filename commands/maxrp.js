const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calcul maxrep')
        .setDescription("Calcule votre poids maximum pour une répétition (1RM).")
        .addNumberOption(option =>
            option.setName('poids')
                .setDescription('Le poids utilisé en kg.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('reps')
                .setDescription('Le nombre de répétitions effectuées.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const poids = interaction.options.getNumber('poids');
        const reps = interaction.options.getInteger('reps');

        // Calcul du 1RM (formule d'Epley)
        const maxRep = (poids * (1 + reps / 30)).toFixed(2);

        await interaction.reply(`💪 **Résultat de votre 1RM** :\n\n- **Poids maximum estimé** : ${maxRep} kg`);
    },
};
