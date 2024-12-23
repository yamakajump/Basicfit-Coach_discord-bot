const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Charger les citations depuis motivation.json
const dataPath = path.join(__dirname, '../data/motivation.json');
const motivations = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('motivation')
        .setDescription('Recevoir une citation motivante aléatoire !'),
    async execute(interaction) {
        console.log('La commande motivation a été appelée.');
        const randomIndex = Math.floor(Math.random() * motivations.citations.length);
        const randomCitation = motivations.citations[randomIndex];
        await interaction.reply(randomCitation);
    },
};
