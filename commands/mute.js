const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute un utilisateur en lui attribuant un rôle.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription("L'utilisateur à mute")
                .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        const mutedRoleId = '1320760751509606400'; // ID du rôle 'Repos forcé'

        const mutedRole = interaction.guild.roles.cache.get(mutedRoleId);

        if (!mutedRole) {
            return interaction.reply({ content: `Le rôle avec l'ID \`${mutedRoleId}\` n'existe pas. Vérifiez l'ID avant d'utiliser cette commande.`, ephemeral: true });
        }

        if (member.roles.cache.has(mutedRole.id)) {
            return interaction.reply({ content: `${user.username} est déjà mute.`, ephemeral: true });
        }

        try {
            await member.roles.add(mutedRole);

            // Envoyer un seul message via interaction.reply()
            await interaction.reply(`${user.username} a été mute avec succès par ${interaction.user.username}.`);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "Une erreur s'est produite lors de l'attribution du rôle.", ephemeral: true });
        }
    },
};
