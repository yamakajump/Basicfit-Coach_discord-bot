const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription("Testez vos connaissances avec une question de culture générale."),
    async execute(interaction) {
        // Exemple de questions trivia
        const questions = [
            {
                question: "Quelle est la capitale de la France ?",
                options: ["Paris", "Lyon", "Marseille", "Nice"],
                answer: "Paris",
            },
            {
                question: "Qui a écrit 'Hamlet' ?",
                options: ["Victor Hugo", "William Shakespeare", "Molière", "Albert Camus"],
                answer: "William Shakespeare",
            },
            {
                question: "Combien de planètes composent notre système solaire ?",
                options: ["7", "8", "9", "10"],
                answer: "8",
            },
            {
                question: "Quelle est la formule chimique de l'eau ?",
                options: ["H2O", "CO2", "O2", "NaCl"],
                answer: "H2O",
            },
        ];

        // Sélection d'une question aléatoire
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

        // Construire le contenu de la question avec les options
        let questionContent = `❓ **${randomQuestion.question}**\n\n`;
        randomQuestion.options.forEach((option, index) => {
            questionContent += `${index + 1}. ${option}\n`;
        });

        // Envoyer la question à l'utilisateur
        await interaction.reply({
            content: questionContent + "\nRépondez avec le numéro correspondant.",
            fetchReply: true,
        });

        // Attendre la réponse de l'utilisateur
        const filter = (response) =>
            response.author.id === interaction.user.id &&
            ["1", "2", "3", "4"].includes(response.content);

        try {
            const collected = await interaction.channel.awaitMessages({
                filter,
                max: 1,
                time: 15000, // 15 secondes pour répondre
                errors: ["time"],
            });

            const userAnswerIndex = parseInt(collected.first().content) - 1;
            const userAnswer = randomQuestion.options[userAnswerIndex];

            if (userAnswer === randomQuestion.answer) {
                return interaction.followUp(`🎉 Bonne réponse ! La bonne réponse était bien **${randomQuestion.answer}**.`);
            } else {
                return interaction.followUp(`❌ Mauvaise réponse. La bonne réponse était **${randomQuestion.answer}**.`);
            }
        } catch (error) {
            return interaction.followUp("⏳ Temps écoulé ! Vous n'avez pas répondu à temps.");
        }
    },
};
