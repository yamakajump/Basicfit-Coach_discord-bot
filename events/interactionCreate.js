const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'interactionCreate',
    execute: async (interaction, client) => {
        if (interaction.isCommand()) {
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
        }

        if (interaction.isModalSubmit()) {
            const modalHandlerPath = path.join(__dirname, '../modals', `${interaction.customId}.js`);
            if (fs.existsSync(modalHandlerPath)) {
                const modalHandler = require(modalHandlerPath);
                try {
                    await modalHandler.execute(interaction);
                } catch (error) {
                    console.error(`Erreur lors du traitement du modal ${interaction.customId}:`, error);
                }
            } else {
                console.error(`Handler de modal ${interaction.customId} non trouvé.`);
            }
        }

        if (interaction.isButton()) {
            // Diviser le customId pour extraire le nom et les paramètres
            const [buttonName, ...params] = interaction.customId.split(':');
            const buttonHandlerPath = path.join(__dirname, '../buttons', `${buttonName}.js`);

            if (fs.existsSync(buttonHandlerPath)) {
                const buttonHandler = require(buttonHandlerPath);
                try {
                    await buttonHandler.execute(interaction, params);
                } catch (error) {
                    console.error(`Erreur lors du traitement du bouton ${interaction.customId}:`, error);
                }
            } else {
                console.error(`Handler de bouton ${buttonName} non trouvé.`);
            }
        }
    },
};
