const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('logsessionModal2')
            .setTitle('Planification : Samedi et Dimanche');

        const weekend = ['Samedi', 'Dimanche'];

        const actionRows = weekend.map(day => {
            return new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId(`session_${day.toLowerCase()}`)
                    .setLabel(`${day} : Heure de la séance ou "aucune"`)
                    .setPlaceholder('HH:MM ou aucune')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
            );
        });

        modal.addComponents(...actionRows);

        await interaction.showModal(modal);
    },
};
