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
        const mutedRoleId = '1320760751509606400'; // Remplace par l'ID du rôle 'Repos forcé'
        const generalChannelId = '1308349548711907360'; // Remplace par l'ID du salon 💪〣général

        const mutedRole = interaction.guild.roles.cache.get(mutedRoleId);
        const generalChannel = interaction.guild.channels.cache.get(generalChannelId);

        if (!mutedRole) {
            return interaction.reply({ content: `Le rôle avec l'ID \`${mutedRoleId}\` n'existe pas. Vérifiez l'ID avant d'utiliser cette commande.`, ephemeral: true });
        }

        if (!generalChannel) {
            console.error(`Le salon avec l'ID ${generalChannelId} n'existe pas.`);
        }

        if (member.roles.cache.has(mutedRole.id)) {
            return interaction.reply({ content: `${user.username} est déjà mute.`, ephemeral: true });
        }

        try {
            await member.roles.add(mutedRole);
            await interaction.reply(`${user.username} a été mute avec succès.`);

            // Notifier dans le salon général
            if (generalChannel) {
                generalChannel.send(`${user.username} a été mute par ${interaction.user.username}.`);
            }
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "Une erreur s'est produite lors de l'attribution du rôle.", ephemeral: true });
        }
    },
};
