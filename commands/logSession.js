const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logsession')
        .setDescription('Enregistre vos heures de séance pour la semaine.'),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('logsessionModal')
            .setTitle('Planification des séances hebdomadaires');

        const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

        const actionRows = days.map(day => {
            const input = new TextInputBuilder()
                .setCustomId(`session_${day.toLowerCase()}`)
                .setLabel(`${day} : Heure de la séance ou "aucune"`)
                .setPlaceholder('HH:MM ou "aucune"')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            return new ActionRowBuilder().addComponents(input);
        });

        modal.addComponents(actionRows);

        await interaction.showModal(modal);
    },
};
