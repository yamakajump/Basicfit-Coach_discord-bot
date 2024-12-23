module.exports = {
    name: 'interactionCreate',
    execute: async (interaction, client) => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`Commande ${interaction.commandName} non trouvée.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Erreur lors de l'exécution de la commande ${interaction.commandName}:`, error);
            await interaction.reply({
                content: 'Une erreur s\'est produite lors de l\'exécution de cette commande.',
                ephemeral: true,
            });
        }
    },
};
