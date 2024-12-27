const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('protein')
        .setDescription("Calcule la quantité de protéines recommandées en fonction de votre poids et de votre objectif.")
        .addNumberOption(option =>
            option.setName('poids')
                .setDescription('Votre poids en kg.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('objectif')
                .setDescription('Votre objectif fitness.')
                .setRequired(true)
                .addChoices(
                    { name: 'Perte de poids', value: 'perte' },
                    { name: 'Maintien', value: 'maintien' },
                    { name: 'Prise de masse', value: 'prise' }
                )
        ),
    async execute(interaction) {
        const poids = interaction.options.getNumber('poids');
        const objectif = interaction.options.getString('objectif');

        // Déterminer le facteur de protéines basé sur l'objectif
        let facteur;
        if (objectif === 'perte') {
            facteur = 2.0; // 2g de protéines par kg de poids corporel
        } else if (objectif === 'maintien') {
            facteur = 1.6; // 1.6g de protéines par kg
        } else if (objectif === 'prise') {
            facteur = 2.2; // 2.2g de protéines par kg
        }

        // Calcul des besoins en protéines
        const besoinsProteines = (poids * facteur).toFixed(2);

        // Réponse
        let objectifTexte = objectif === 'perte' ? 'Perte de poids' :
                            objectif === 'maintien' ? 'Maintien' : 'Prise de masse';

        await interaction.reply(`🍗 **Besoins en protéines** :\n\n- **Objectif** : ${objectifTexte}\n- **Quantité recommandée** : ${besoinsProteines} g par jour`);
    },
};
