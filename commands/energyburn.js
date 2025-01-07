const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calcul energyburn')
        .setDescription("Estime les calories brûlées en fonction de l'activité et de la durée.")
        .addStringOption(option =>
            option.setName('activite')
                .setDescription('Le type d\'activité.')
                .setRequired(true)
                .addChoices(
                    { name: 'Course à pied', value: 'course' },
                    { name: 'Marche', value: 'marche' },
                    { name: 'Cyclisme', value: 'cyclisme' },
                    { name: 'Natation', value: 'natation' },
                    { name: 'Musculation', value: 'musculation' }
                )
        )
        .addNumberOption(option =>
            option.setName('duree')
                .setDescription('Durée de l\'activité en minutes.')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName('poids')
                .setDescription('Votre poids en kg.')
                .setRequired(true)
        ),
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
