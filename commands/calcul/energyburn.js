module.exports = {
    async execute(interaction) {
        const activite = interaction.options.getString('activite');
        const duree = interaction.options.getNumber('duree');
        const poids = interaction.options.getNumber('poids');

        // MET pour les activités (valeurs approximatives)
        const metValues = {
            course: 9.8,    // Course à 8 km/h
            marche: 3.8,    // Marche à 5 km/h
            cyclisme: 7.5,  // Cyclisme modéré
            natation: 8.0,  // Natation modérée
            musculation: 6.0 // Musculation modérée
        };

        // Calcul des calories brûlées
        const met = metValues[activite];
        const caloriesBrulees = ((met * poids * 3.5) / 200 * duree).toFixed(2);

        // Texte de l'activité
        const activiteText = {
            course: "Course à pied",
            marche: "Marche",
            cyclisme: "Cyclisme",
            natation: "Natation",
            musculation: "Musculation"
        };

        // Réponse
        await interaction.reply(`\<a:feu:1321793901350223932> **Estimation des calories brûlées** :\n\n` +
            `- **Activité** : ${activiteText[activite]}\n` +
            `- **Durée** : ${duree} minutes\n` +
            `- **Poids** : ${poids} kg\n\n` +
            `\<:explosion:1322215916741595217> **Calories brûlées** : ${caloriesBrulees} kcal`);
    },
};
