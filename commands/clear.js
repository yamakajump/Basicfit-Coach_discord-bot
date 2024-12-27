const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Supprime un certain nombre de messages dans le canal actuel.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription("Le nombre de messages à supprimer (entre 1 et 100).")
                .setRequired(true)
        ),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        // Vérification de la limite
        if (amount < 1 || amount > 100) {
            return interaction.reply({ 
                content: "Veuillez spécifier un nombre entre 1 et 100.", 
                ephemeral: true 
            });
        }

        try {
            // Suppression des messages
            const deletedMessages = await interaction.channel.bulkDelete(amount, true);

            // Répondre avec le nombre de messages supprimés
            await interaction.reply({ 
                content: `✅ ${deletedMessages.size} messages supprimés !`, 
                ephemeral: true 
            });
        } catch (error) {
            console.error(error);
            interaction.reply({ 
                content: "Une erreur s'est produite lors de la suppression des messages. Vérifiez que je dispose des permissions nécessaires.", 
                ephemeral: true 
            });
        }
    },
};
