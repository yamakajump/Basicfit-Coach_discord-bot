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
        const mutedRole = interaction.guild.roles.cache.find(role => role.name === 'Repos forcé'); // Change 'Muted' si le nom est différent

        if (!mutedRole) {
            return interaction.reply({ content: "Le rôle 'Repos forcé' n'existe pas. Créez-le avant d'utiliser cette commande.", ephemeral: true });
        }

        if (member.roles.cache.has(mutedRole.id)) {
            return interaction.reply({ content: `${user.username} est déjà mute.`, ephemeral: true });
        }

        try {
            await member.roles.add(mutedRole);
            await interaction.reply(`${user.username} a été mute avec succès.`);

            // Notifier dans le salon général
            const generalChannel = interaction.guild.channels.cache.find(channel => channel.name === '💪〣général'); // Change 'general' si le nom est différent
            if (generalChannel) {
                generalChannel.send(`${user.username} a été mute par ${interaction.user.username}.`);
            }
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "Une erreur s'est produite lors de l'attribution du rôle.", ephemeral: true });
        }
    },
};
