module.exports = {
    async execute(interaction) {
        const poids = interaction.options.getNumber('poids');
        const taille = interaction.options.getNumber('taille');
        const age = interaction.options.getInteger('age');
        const sexe = interaction.options.getString('sexe');
        const activite = interaction.options.getString('activite');

        // Calcul du métabolisme de base (MB)
        let mb;
        if (sexe === 'homme') {
            mb = 10 * poids + 6.25 * taille - 5 * age + 5;
        } else {
            mb = 10 * poids + 6.25 * taille - 5 * age - 161;
        }

        // Facteur d'activité
        const facteurs = {
            sedentaire: 1.2,
            leger: 1.375,
            modere: 1.55,
            actif: 1.725,
            extreme: 1.9,
        };

        const besoins = (mb * facteurs[activite]).toFixed(2);

        // Réponse
        await interaction.reply({
            content: `<:cookie:1321862688095080548> **Besoins caloriques estimés** :\n\n- **Calories par jour** : ${besoins} kcal`,
        });
    },
};
