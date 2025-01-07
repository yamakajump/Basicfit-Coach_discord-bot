module.exports = {
    async execute(interaction) {
        const poids = interaction.options.getNumber('poids');
        const taille = interaction.options.getNumber('taille') / 100; // Convertir la taille en mètres
        const tourDeTaille = interaction.options.getNumber('tourdetaille');
        const age = interaction.options.getInteger('age');
        const sexe = interaction.options.getString('sexe');

        // Calcul du pourcentage de masse grasse selon la formule simplifiée
        let bodyFatPercentage;
        if (sexe === 'homme') {
            bodyFatPercentage = (1.20 * (poids / (taille * taille))) + (0.23 * age) - (10.8 * 1) - 5.4; // Homme
        } else {
            bodyFatPercentage = (1.20 * (poids / (taille * taille))) + (0.23 * age) - (10.8 * 0) - 5.4; // Femme
        }

        bodyFatPercentage = bodyFatPercentage.toFixed(2);

        // Réponse
        await interaction.reply({
            content: `<:coin_info:1321862685578756167> **Résultat de votre pourcentage de masse grasse :**\n\n- **Masse grasse estimée** : ${bodyFatPercentage}%`,
        });
    },
};
