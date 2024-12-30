const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

const Discord = require("discord.js");
const emojis = require("../data/emojis.js");

module.exports = {
    name: "rradd",
    usage: "rradd [channel mention | channelID] [messageID] [role mention | roleID] [emoji]",
    run: async (client, message, args, db) => {
        try {
            if (!args[0]) return message.channel.send(`:x: | **Specify The ChannelID or mention The Channel**`);
            if (!args[1]) return message.channel.send(`:x: | **Specify The messageID**`);
            if (!args[2]) return message.channel.send(`:x: | **Specify The roleID or mention The Role**`);
            if (!args[3]) return message.channel.send(`:x: | **Specify The emoji**`);

            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
            if (!channel) return message.channel.send(`:x: | **Channel Not Found**`);

            let msg = await channel.messages.fetch(args[1]);
            if (!msg) return message.channel.send(`:x: | **Message Not Found**`);

            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
            if (!role) return message.channel.send(`:x: | **Role Not Found**`);
            if (role.position >= message.guild.me.roles.highest.position) {
                return message.channel.send(`:x: | **I cannot assign or manage this role due to role hierarchy issues.**`);
            }

            let emoji = await Discord.Util.parseEmoji(args[3]);
            if (!emoji && !emojis.includes(args[3])) return message.channel.send(":x: | **Specify a valid Emoji**");

            let checking = emoji && !emojis.includes(args[3]) && client.emojis.cache.find(x => x.id === emoji.id);
            if (emoji && !checking) return message.channel.send(`:x: | **Invalid Emoji**`);

            let pog = db.get(`reactions_${message.guild.id}_${msg.id}`);
            if (pog && pog.find((x) => x.emoji === args[3])) {
                return message.channel.send(`:x: | **The emoji is already being used for a reaction role!**`);
            }

            await msg.react(args[3]);
            db.push(`reactions_${message.guild.id}_${msg.id}`, { emoji: args[3], roleId: role.id });

            let embed = new Discord.MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setTitle("Success")
                .setDescription(`**The Reaction Role has been Set up**`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setColor("RANDOM")
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.channel.send(":x: | **An unexpected error occurred. Please try again later.**");
        }
    },
};
