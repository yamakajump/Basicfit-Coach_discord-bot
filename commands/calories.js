const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calcul_calories')
        .setDescription("Estime vos besoins caloriques quotidiens.")
        .addNumberOption(option =>
            option.setName('poids')
                .setDescription('Votre poids en kg.')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName('taille')
                .setDescription('Votre taille en cm.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('age')
                .setDescription('Votre âge.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('sexe')
                .setDescription('Votre sexe.')
                .addChoices(
                    { name: 'Homme', value: 'homme' },
                    { name: 'Femme', value: 'femme' }
                )
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('activite')
                .setDescription("Votre niveau d'activité.")
                .addChoices(
                    { name: 'Sédentaire', value: 'sedentaire' },
                    { name: 'Légèrement actif', value: 'leger' },
                    { name: 'Modérément actif', value: 'modere' },
                    { name: 'Très actif', value: 'actif' },
                    { name: 'Extrêmement actif', value: 'extreme' }
                )
                .setRequired(true)
        ),
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

        await interaction.reply(`\<:cookie:1321862688095080548> **Besoins caloriques estimés** :\n\n- **Calories par jour** : ${besoins} kcal`);
    },
};
