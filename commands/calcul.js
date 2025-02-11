const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calcul')
        .setDescription('Commandes pour effectuer divers calculs.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('bodyfat')
                .setDescription("Calcule votre pourcentage de masse grasse.")
                .addNumberOption(option =>
                    option.setName('poids')
                        .setDescription('Votre poids en kg.')
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName('taille')
                        .setDescription('Votre taille en cm.')
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName('tourdetaille')
                        .setDescription('Votre tour de taille en cm.')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('age')
                        .setDescription('Votre âge.')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('sexe')
                        .setDescription('Votre sexe.')
                        .addChoices(
                            { name: 'Homme', value: 'homme' },
                            { name: 'Femme', value: 'femme' }
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('calories')
                .setDescription("Estime vos besoins caloriques quotidiens.")
                .addNumberOption(option =>
                    option.setName('poids')
                        .setDescription('Votre poids en kg.')
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName('taille')
                        .setDescription('Votre taille en cm.')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('age')
                        .setDescription('Votre âge.')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('sexe')
                        .setDescription('Votre sexe.')
                        .addChoices(
                            { name: 'Homme', value: 'homme' },
                            { name: 'Femme', value: 'femme' }
                        )
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('activite')
                        .setDescription("Votre niveau d'activité.")
                        .addChoices(
                            { name: 'Sédentaire (peu ou pas d\'exercice)', value: 'sedentaire' },
                            { name: 'Légèrement actif (exercice léger ou sport 1-3 jours par semaine)', value: 'leger' },
                            { name: 'Modérément actif (exercice modéré ou sport 3-5 jours par semaine)', value: 'modere' },
                            { name: 'Très actif (exercice intense ou sport 6-7 jours par semaine)', value: 'actif' },
                            { name: 'Extrêmement actif (exercice très intense ou travail physique)', value: 'extreme' }
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('energyburn')
                .setDescription("Estime les calories brûlées en fonction de l'activité et de la durée.")
                .addStringOption(option =>
                    option.setName('activite')
                        .setDescription('Le type d\'activité.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Course à pied', value: 'course' },
                            { name: 'Marche', value: 'marche' },
                            { name: 'Cyclisme', value: 'cyclisme' },
                            { name: 'Natation', value: 'natation' },
                            { name: 'Musculation', value: 'musculation' }
                        )
                )
                .addNumberOption(option =>
                    option.setName('duree')
                        .setDescription('Durée de l\'activité en minutes.')
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName('poids')
                        .setDescription('Votre poids en kg.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('fatloss')
                .setDescription("Estime le déficit calorique nécessaire pour perdre du poids.")
                .addNumberOption(option =>
                    option.setName('poids_actuel')
                        .setDescription('Votre poids actuel en kg.')
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName('poids_cible')
                        .setDescription('Votre poids cible en kg.')
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName('taille')
                        .setDescription('Votre taille en cm.')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('age')
                        .setDescription('Votre âge.')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('sexe')
                        .setDescription('Votre sexe.')
                        .addChoices(
                            { name: 'Homme', value: 'homme' },
                            { name: 'Femme', value: 'femme' }
                        )
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName('duree')
                        .setDescription('Durée pour atteindre votre objectif (en mois).')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('activite')
                        .setDescription('Votre niveau d\'activité.')
                        .addChoices(
                            { name: 'Sédentaire', value: 'sedentaire' },
                            { name: 'Légèrement actif', value: 'leger' },
                            { name: 'Modérément actif', value: 'modere' },
                            { name: 'Très actif', value: 'actif' },
                            { name: 'Extrêmement actif', value: 'extreme' }
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('imc')
                .setDescription("Calcule votre indice de masse corporelle (IMC).")
                .addNumberOption(option =>
                    option.setName('poids')
                        .setDescription('Votre poids en kg.')
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName('taille')
                        .setDescription('Votre taille en cm.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('macro')
                .setDescription("Calcule la répartition des macronutriments en fonction de vos besoins caloriques.")
                .addNumberOption(option =>
                    option.setName('calories')
                        .setDescription('Vos besoins caloriques journaliers en kcal.')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('objectif')
                        .setDescription('Votre objectif nutritionnel.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Perte de poids', value: 'perte' },
                            { name: 'Maintien', value: 'maintien' },
                            { name: 'Prise de masse', value: 'prise' },
                            { name: 'Recomposition corporelle', value: 'recomp' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('maxrep')
                .setDescription("Calcule votre poids maximum pour une répétition (1RM).")
                .addNumberOption(option =>
                    option.setName('poids')
                        .setDescription('Le poids utilisé en kg.')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('reps')
                        .setDescription('Le nombre de répétitions effectuées.')
                        .setRequired(true)
                )
        )
        ,
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        try {
            // Charger dynamiquement la sous-commande correspondante
            const subcommandFile = require(path.join(__dirname, 'calcul', `${subcommand}.js`));
            await subcommandFile.execute(interaction);
        } catch (error) {
            console.error(`Erreur lors de l'exécution de la sous-commande ${subcommand}:`, error);
            await interaction.reply({
                content: `Une erreur est survenue lors de l'exécution de la commande ${subcommand}.`,
                ephemeral: true,
            });
        }
    },
};
