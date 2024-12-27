const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('imc')
        .setDescription("Calcule votre indice de masse corporelle (IMC).")
        .addNumberOption(option =>
            option.setName('poids')
                .setDescription('Votre poids en kg.')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName('taille')
                .setDescription('Votre taille en cm.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const poids = interaction.options.getNumber('poids');
        const tailleCm = interaction.options.getNumber('taille');

        // Conversion de la taille en mètres
        const taille = tailleCm / 100;

        // Calcul de l'IMC
        const imc = (poids / (taille * taille)).toFixed(2);

        // Classification de l'IMC
        let classification;
        if (imc < 18.5) classification = "Insuffisance pondérale (maigreur)";
        else if (imc >= 18.5 && imc < 24.9) classification = "Poids normal";
        else if (imc >= 25 && imc < 29.9) classification = "Surpoids";
        else classification = "Obésité";

        // Réponse
        await interaction.reply(`\<:rouge:843212747998232666> **Résultat de votre IMC** :\n\n- **IMC** : ${imc}\n- **Classification** : ${classification}`);
    },
};
