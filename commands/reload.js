const { SlashCommandBuilder } = require('discord.js');

let botStartTime = Date.now();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Redémarre le bot si une minute s\'est écoulée depuis son lancement.'),
    async execute(interaction) {
        const currentTime = Date.now();
        const elapsedTime = (currentTime - botStartTime) / 1000; // Temps écoulé en secondes

        if (elapsedTime < 60) {
            await interaction.reply({
                content: `Le bot ne peut pas être redémarré avant une minute après son lancement. Temps restant : ${Math.ceil(60 - elapsedTime)} secondes.`,
                ephemeral: true,
            });
            return;
        }

        await interaction.reply('Le bot va redémarrer...');
        console.log('Le bot redémarre suite à une demande via /reload.');
        process.exit(0); // Arrête le processus pour que votre gestionnaire le redémarre
    },
};
