module.exports = {
    async execute(interaction) {
        const calories = interaction.options.getNumber('calories');
        const objectif = interaction.options.getString('objectif');

        // Déterminer les pourcentages pour chaque macronutriment
        let proteinesPct, lipidesPct, glucidesPct;

        if (objectif === 'perte') {
            proteinesPct = 35; // 35% des calories
            lipidesPct = 25;   // 25% des calories
            glucidesPct = 40;  // 40% des calories
        } else if (objectif === 'maintien') {
            proteinesPct = 30; // 30% des calories
            lipidesPct = 30;   // 30% des calories
            glucidesPct = 40;  // 40% des calories
        } else if (objectif === 'prise') {
            proteinesPct = 25; // 25% des calories
            lipidesPct = 25;   // 25% des calories
            glucidesPct = 50;  // 50% des calories
        } else if (objectif === 'recomp') {
            proteinesPct = 35; // 35% des calories
            lipidesPct = 20;   // 20% des calories
            glucidesPct = 45;  // 45% des calories
        }

        // Calcul des grammes pour chaque macronutriment
        const proteinesGr = ((calories * proteinesPct) / 100 / 4).toFixed(2); // 1 g de protéine = 4 kcal
        const lipidesGr = ((calories * lipidesPct) / 100 / 9).toFixed(2);    // 1 g de lipide = 9 kcal
        const glucidesGr = ((calories * glucidesPct) / 100 / 4).toFixed(2);  // 1 g de glucide = 4 kcal

        // Réponse
        const objectifTexte = objectif === 'perte' ? 'Perte de poids' :
                              objectif === 'maintien' ? 'Maintien' :
                              objectif === 'prise' ? 'Prise de masse' : 'Recomposition corporelle';

        await interaction.reply({
            content: `\<:coin_info:1321862685578756167>  **Répartition des macronutriments** :\n\n` +
                     `- **Objectif** : ${objectifTexte}\n` +
                     `- **Calories totales** : ${calories} kcal\n\n` +
                     `\<:cookie:1321862688095080548> **Macronutriments** :\n` +
                     `- **Protéines** : ${proteinesGr} g (${proteinesPct}%)\n` +
                     `- **Lipides** : ${lipidesGr} g (${lipidesPct}%)\n` +
                     `- **Glucides** : ${glucidesGr} g (${glucidesPct}%)`,
        });
    },
};
