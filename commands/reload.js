const { SlashCommandBuilder } = require('discord.js');

let botStartTime = Date.now();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Redémarre le bot si une minute s\'est écoulée depuis son lancement.')
        .setDefaultMemberPermissions('32'), // = Gérer le serveur
    async execute(interaction) {
        // Vérification explicite des permissions
        if (!interaction.member.permissions.has('ManageGuild')) {
            return interaction.reply({
                content: "❌ Vous n'avez pas la permission d'utiliser cette commande.",
                ephemeral: true,
            });
        }

        const currentTime = Date.now();
        const elapsedTime = (currentTime - botStartTime) / 1000;

        if (elapsedTime < 60) {
            await interaction.reply({
                content: `Le bot ne peut pas être redémarré avant une minute après son lancement. Temps restant : ${Math.ceil(60 - elapsedTime)} secondes.`,
                ephemeral: true,
            });
            return;
        }

        await interaction.reply('Je reviens vite mes GymBro !');
        console.log('Le bot redémarre suite à une demande via /reload.');
        process.exit(0);
    },
};
