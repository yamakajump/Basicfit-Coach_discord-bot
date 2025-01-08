const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configure les différentes fonctionnalités du bot.')
        .setDefaultMemberPermissions('32') // = Gérer le serveur
        .addSubcommand(subcommand =>
            subcommand
                .setName('add_motivation_channel')
                .setDescription('Ajoute un salon pour envoyer la motivation du jour.')
                .addChannelOption(option =>
                    option.setName('salon')
                        .setDescription('Salon où envoyer les messages de motivation.')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('ping')
                        .setDescription('Qui doit être mentionné ?')
                        .addChoices(
                            { name: 'Personne', value: 'none' },
                            { name: '@everyone', value: 'everyone' },
                            { name: 'Utilisateur spécifique', value: 'user' }
                        )
                )
                .addUserOption(option =>
                    option.setName('utilisateur')
                        .setDescription('Utilisateur à mentionner (si choisi).')
                )
                .addStringOption(option =>
                    option.setName('heure')
                        .setDescription('Heure custom au format HH:mm (optionnel).')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('set_motivation_hour')
                .setDescription('Modifie l\'heure par défaut pour la motivation.')
                .addStringOption(option =>
                    option.setName('heure')
                        .setDescription('Nouvelle heure par défaut au format HH:mm.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('add_notification_channel')
                .setDescription('Ajoute le salon pour les notifications des séances.')
                .addChannelOption(option =>
                    option.setName('salon')
                        .setDescription('Salon où envoyer les notifications.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('toggle_startup_message')
                .setDescription('Active ou désactive le message au lancement du bot.')
                .addBooleanOption(option =>
                    option.setName('etat')
                        .setDescription('Activer ou désactiver ?')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('Message à envoyer au lancement (optionnel).')
                )
                .addChannelOption(option =>
                    option.setName('salon')
                        .setDescription('Salon où envoyer le message de démarrage (optionnel).')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove_motivation_channel')
                .setDescription('Supprime un salon de la liste des messages de motivation.')
                .addChannelOption(option =>
                    option.setName('salon')
                        .setDescription('Salon à supprimer.')
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        // Vérification explicite des permissions "Gérer le serveur"
        if (!interaction.member.permissions.has('ManageGuild')) { // 'ManageGuild' correspond à "Gérer le serveur"
            return interaction.reply({
                content: "❌ Vous n'avez pas la permission d'utiliser cette commande.",
                ephemeral: true,
            });
        }

        const subcommand = interaction.options.getSubcommand();

        try {
            // Charger dynamiquement le fichier de la sous-commande
            const subcommandFile = require(`./config/${subcommand}.js`);
            await subcommandFile.execute(interaction);
        } catch (error) {
            console.error(`Erreur lors de l'exécution de la sous-commande ${subcommand}:`, error);
            await interaction.reply({
                content: `Une erreur est survenue lors de l'exécution de la commande \`${subcommand}\`.`,
                ephemeral: true,
            });
        }
    },
};
