module.exports = {
    async execute(interaction) {
        const poids = interaction.options.getNumber('poids');
        const reps = interaction.options.getInteger('reps');

        // Calcul du 1RM (formule d'Epley)
        const maxRep = (poids * (1 + reps / 30)).toFixed(2);

        // Réponse
        await interaction.reply({
            content: `💪 **Résultat de votre 1RM** :\n\n` +
                     `- **Poids maximum estimé** : ${maxRep} kg`,
        });
    },
};
