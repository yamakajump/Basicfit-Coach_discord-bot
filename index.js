const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
require('dotenv').config();

// Créez une instance du bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// ID du canal pour rapporter les erreurs
const ERROR_CHANNEL_ID = '1320725724994474015';

// Collection des commandes
client.commands = new Collection();
const commands = [];

// Charger toutes les commandes
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// Charger les événements
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Enregistrer les commandes auprès de Discord
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Démarrage de l\'enregistrement des commandes slash.');

        const clientId = '1320700475414151198';
        const guildId = '1308349546648174602';

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );

        console.log('Les commandes slash ont été enregistrées avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement des commandes:', error);
        reportError(client, `Erreur lors de l'enregistrement des commandes:\n\`\`\`${error.message}\`\`\``);
    }
})();

global.botStartTime = Date.now();

client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.guild) return;
	if (!message.content.startsWith(prefix)) return;
	if (!message.member)
		message.member = await message.guild.members.fetch(message);

	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const cmd = args.shift().toLowerCase();

	if (cmd.length === 0) return;

	let command = client.commands.get(cmd);
	if (!command) command = client.commands.get(client.aliases.get(cmd));
	if (command) command.run(client, message, args, db);
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;
  const { guild } = reaction.message;
  if (!guild) return;
  if (!guild.me.hasPermission("MANAGE_ROLES")) return;
  const member = guild.members.cache.get(user.id);
  if (!member) return;
const data = db.get(`reactions_${guild.id}_${reaction.message.id}`)
  if (!data) return;
  const reaction2 = data.find(
    (r) => r.emoji === reaction.emoji.toString()
  );
  if (!reaction2) return;
member.roles.add(reaction2.roleId).catch(err => undefined);
});

client.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;
  const { guild } = reaction.message;
  if (!guild) return;
  if (!guild.me.hasPermission("MANAGE_ROLES")) return;
  const member = guild.members.cache.get(user.id);
  if (!member) return;
const data = db.get(`reactions_${guild.id}_${reaction.message.id}`)
  if (!data) return;
  const reaction3 = data.find(
    (r) => r.emoji === reaction.emoji.toString()
  );
  if (!reaction3) return;
member.roles.remove(reaction3.roleId).catch(err => undefined);
});

// Lancer le bot
client.login(process.env.TOKEN);
