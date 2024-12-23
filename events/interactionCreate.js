const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { scheduleNotifications, resetNotifications } = require('./notificationScheduler');
const fs = require('fs');
const path = require('path');

// Fichier pour stocker les horaires des séances
const dataPath = path.join(__dirname, '../data/sessions.json');

// Charger ou initialiser les données des séances
function loadSessions() {
    if (!fs.existsSync(dataPath)) {
        fs.writeFileSync(dataPath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function saveSessions(sessions) {
    fs.writeFileSync(dataPath, JSON.stringify(sessions, null, 4));
}

module.exports = {
    name: 'interactionCreate',
    execute: async (interaction, client) => {
        const sessions = loadSessions();
        const userId = interaction.user.id;

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
            // Créer une entrée pour l'utilisateur s'il n'existe pas encore
            if (!sessions[userId]) {
                sessions[userId] = {};
            }

            const isValidTime = (input) => {
                const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // Format HH:MM
                return timeRegex.test(input);
            };

            // Traiter le premier modal (Lundi à Vendredi)
            if (interaction.customId === 'logsessionModal1') {
                const weekdays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];

                weekdays.forEach(day => {
                    const input = interaction.fields.getTextInputValue(`session_${day}`);
                    if (input.trim() !== '') {
                        sessions[userId][day] = isValidTime(input) ? input : null;
                    } else {
                        sessions[userId][day] = null;
                    }
                });

                saveSessions(sessions);

                // Répondre avec un bouton pour continuer avec le second modal
                const button = new ButtonBuilder()
                    .setCustomId('continueToWeekend')
                    .setLabel('Compléter Samedi et Dimanche')
                    .setStyle(ButtonStyle.Primary);

                const row = new ActionRowBuilder().addComponents(button);

                await interaction.reply({
                    content: 'Vos séances pour Lundi à Vendredi ont été enregistrées. Cliquez sur le bouton ci-dessous pour compléter Samedi et Dimanche.',
                    components: [row],
                    ephemeral: true,
                });

                resetNotifications(client); // Réinitialiser les notifications
            }

            // Traiter le second modal (Samedi et Dimanche)
            if (interaction.customId === 'logsessionModal2') {
                const weekend = ['samedi', 'dimanche'];

                weekend.forEach(day => {
                    const input = interaction.fields.getTextInputValue(`session_${day}`);
                    if (input.trim() !== '') {
                        sessions[userId][day] = isValidTime(input) ? input : null;
                    } else {
                        sessions[userId][day] = null;
                    }
                });

                saveSessions(sessions);

                await interaction.reply({
                    content: 'Vos séances pour Samedi et Dimanche ont été enregistrées. Merci !',
                    ephemeral: true,
                });

                resetNotifications(client); // Réinitialiser les notifications
            }
        }

        // Si le bouton est cliqué, envoyer le second modal
        if (interaction.isButton() && interaction.customId === 'continueToWeekend') {
            const modal2 = new ModalBuilder()
                .setCustomId('logsessionModal2')
                .setTitle('Planification : Samedi et Dimanche');

            const weekend = ['Samedi', 'Dimanche'];

            const actionRows = weekend.map(day => {
                const input = new TextInputBuilder()
                    .setCustomId(`session_${day.toLowerCase()}`)
                    .setLabel(`${day} : Heure de la séance ou "aucune"`)
                    .setPlaceholder('HH:MM ou aucune')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false);

                return new ActionRowBuilder().addComponents(input);
            });

            modal2.addComponents(...actionRows);

            await interaction.showModal(modal2);
        }
    },
};
