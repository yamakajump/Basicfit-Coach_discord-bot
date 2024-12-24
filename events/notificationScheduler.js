const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const schedule = require("node-schedule");
const { formatInTimeZone } = require("date-fns-tz");
const { parse } = require("date-fns");
const fs = require("fs");
const path = require("path");

// ID du canal où envoyer les notifications
const CHANNEL_ID = "1320775045940904090";

// Fichier contenant les horaires des séances
const dataPath = path.join(__dirname, "../data/sessions.json");

// Charger ou initialiser les données des séances
function loadSessions() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

// Stocker les tâches planifiées
let scheduledJobs = [];

// Planifier les notifications
function scheduleNotifications(client) {
  const sessions = loadSessions();
  const timezone = "Europe/Paris";

  // Supprimer toutes les tâches existantes
  scheduledJobs.forEach((job) => job.cancel());
  scheduledJobs = [];

  // Parcourir les utilisateurs et leurs horaires
  for (const [userId, scheduleData] of Object.entries(sessions)) {
    for (const [day, time] of Object.entries(scheduleData)) {
      if (time) {
        // Calculer la prochaine occurrence du jour et de l'heure spécifiés
        const nextDateTime = getNextOccurrence(day, time, timezone);

        // Planifier la notification
        const job = schedule.scheduleJob(nextDateTime, async () => {
          try {
            const channel = await client.channels.fetch(CHANNEL_ID);
            if (!channel || !channel.isTextBased()) {
              console.error(
                `Le canal ${CHANNEL_ID} est introuvable ou non valide.`
              );
              return;
            }

            const actionRow = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(`confirm_${userId}_${day}_${time}_yes`)
                .setLabel("Oui")
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId(`confirm_${userId}_${day}_${time}_no`)
                .setLabel("Non")
                .setStyle(ButtonStyle.Danger)
            );

            await channel.send({
              content: `<@${userId}> C'est l'heure de ta séance du **${day}** à **${time}**. Bonne séance ! 💪 \r### **Séance réalisée ?**`,
              components: [actionRow],
            });
          } catch (error) {
            console.error(
              `Erreur lors de l'envoi de la notification pour l'utilisateur ${userId}:`,
              error
            );
          }
        });

        scheduledJobs.push(job);
      }
    }
  }
}

// Obtenir la prochaine occurrence du jour et de l'heure spécifiés
function getNextOccurrence(day, time, timezone) {
  const daysOfWeek = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];

  const now = new Date();
  const targetDayIndex = daysOfWeek.indexOf(day.toLowerCase());
  if (targetDayIndex === -1) {
    throw new Error(`Jour invalide : ${day}`);
  }

  // Convertir le temps en heures et minutes
  const [hours, minutes] = time.split(":").map(Number);

  // Calculer la date cible
  let targetDate = new Date(now);
  targetDate.setHours(hours, minutes, 0, 0);

  // Ajuster pour le jour de la semaine
  while (targetDate.getDay() !== targetDayIndex || targetDate <= now) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  // Convertir en heure locale de Paris
  const parisDateTime = formatInTimeZone(
    targetDate,
    timezone,
    "yyyy-MM-dd HH:mm:ssXXX"
  );
  return parse(parisDateTime, "yyyy-MM-dd HH:mm:ssXXX", new Date());
}

// Réinitialiser les notifications après modification des données
function resetNotifications(client) {
  scheduledJobs.forEach((job) => job.cancel());
  scheduledJobs = [];
  scheduleNotifications(client);
}

module.exports = { scheduleNotifications, resetNotifications };
