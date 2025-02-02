# Basicfit Coach - Discord Bot

Un bot Discord conçu pour accompagner les passionnés de musculation et de fitness en leur proposant des outils pratiques, des calculs nutritionnels, des statistiques personnalisées et des citations motivantes pour atteindre leurs objectifs.

## Table des matières
1. [Introduction](#introduction)
2. [Fonctionnalités](#fonctionnalités)
    - [Commandes Slash](#commandes-slash)
    - [Messages quotidiens](#messages-quotidiens)
3. [Prérequis](#prérequis)
4. [Installation](#installation)
5. [Configuration](#configuration)
   - [Ajouter des Citations](#ajouter-des-citations)
   - [Modifier les Messages Automatiques](#modifier-les-messages-automatiques)
6. [Statistiques Personnalisées](#statistiques-personnalisées)
7. [Architecture du Projet](#architecture-du-projet)
8. [Dépendances](#dépendances)
9. [Contribution](#contribution)
10. [Licence](#licence)

---

## Introduction

Basicfit Coach est un bot Discord dédié à la musculation et au bien-être. Que vous soyez débutant ou confirmé, ce bot vous propose :
- Des calculs personnalisés (IMC, besoins caloriques, macro-nutriments, etc.).
- Des outils pour suivre vos performances en salle de sport.
- Des statistiques de vos activités.
- Des citations motivantes pour garder la flamme.
- Une intégration simple et intuitive pour améliorer l'expérience des membres du serveur.

## Fonctionnalités

![heatmap](https://github.com/user-attachments/assets/e0c5d7c9-c539-4030-b1e5-52d79c869eed)


### Commandes Slash

| Commande                               | Description                                                                                            |
|----------------------------------------|--------------------------------------------------------------------------------------------------------|
| `/motivation`                          | Envoie une citation motivante aléatoire.                                                               |
| `/notif_seance`                        | Enregistre les heures des séances de sport pour recevoir une notification                              |
| `/topSeance`                           | Affiche le classement des séances validées et non effectuées.                                          |
| `/config add_motivation_channel`       | Configure les salons pour l'envoi des citations motivantes, avec options pour ping (utilisateur, everyone, ou personne). |
| `/config delete_motivation_channel`    | Supprime un salon de la liste des salons de motivation.                                                |
| `/config set_default_motivation_hour`  | Modifie l'heure d'envoi par défaut des messages de motivation quotidienne.                             |
| `/config add_notif_channel`            | Configure le salon pour les notifications des séances.                                                 |
| `/config toggle_startup_message`       | Active ou désactive le message au démarrage du bot, avec une option pour personnaliser le message.     |
| `/calcul imc`                          | Calcule l'indice de masse corporelle (IMC) en fonction du poids et de la taille.                       |
| `/calcul bodyfat`                      | Estime le pourcentage de masse grasse à partir de plusieurs paramètres.                                |
| `/calcul calories`                     | Calcule les besoins caloriques journaliers en fonction de l'activité.                                  |
| `/calcul macro`                        | Propose une répartition des macronutriments selon les besoins caloriques.                              |
| `/calcul fatloss`                      | Estime le déficit calorique nécessaire pour atteindre un poids cible.                                  |
| `/calcul maxrp`                        | Calcule le poids maximum pour une répétition (1RM).                                                    |
| `/calcul energyburn`                   | Estime les calories brûlées en fonction de l'activité et de la durée.                                  |
| `/basicfit upload`                     | Téléchargez vos données depuis Basic Fit - My Data pour utiliser les outils d'analyse.                 |
| `/basicfit stats heatmap`              | Génère une heatmap pour visualiser vos visites en salle.                                               |
| `/basicfit stats streakDay`            | Affiche le plus grand nombre de jours consécutifs où vous êtes allé à la salle.                        |
| `/basicfit stats streakWeek`           | Affiche le plus grand nombre de semaines consécutives où vous êtes allé à la salle.                    |
| `/basicfit stats averageWeek`          | Calcule la moyenne des jours où vous êtes allé à la salle par semaine.                                 |
| `/basicfit stats bestMonth`            | Identifie le mois où vous avez été le plus assidu.                                                     |
| `/basicfit stats favoriteDay`          | Affiche le jour de la semaine où vous allez le plus souvent à la salle.                                |
| `/basicfit stats visitsByDay`          | Affiche combien de fois vous êtes allé à la salle chaque jour de la semaine.                           |
| `/basicfit stats timeOfDay`            | Analyse les horaires de vos séances pour identifier vos périodes d’entraînement préférées.             |
| `/basicfit stats activePercentage`     | Calcule le pourcentage de jours où vous êtes allé à la salle par rapport à la période totale couverte. |
| `/basicfit stats locations`            | Liste les clubs visités et leur fréquence.                                                             |
| `/basicfit stats avgTimeBetweenVisits` | Calcule la moyenne de temps entre deux séances.                                                        |
| `/basicfit compare`                    | Compare vos statistiques avec celles d’un autre membre du serveur.                                     |
| `/basicfit serverStats`                | Affiche des statistiques globales du serveur.                                                          |
| `/reload`                              | Reload le bot                                                                                          |

### Messages quotidiens

- Le bot envoie chaque jour une citation motivante à une heure définie dans un canal spécifique. Ces citations peuvent être personnalisées.

![daily](https://github.com/user-attachments/assets/f5cb0f0e-57cb-410b-9937-7a3959fa5b93)

## Prérequis

- [Node.js](https://nodejs.org/) version 16 ou supérieure.
- Un compte Discord avec accès au portail développeur.
- Permissions d’administration pour ajouter un bot sur un serveur.

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone <URL_DU_DEPOT>
   cd <NOM_DU_DEPOT>
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer le fichier `.env`**
   Le fichier .env est essentiel pour le bon fonctionnement du bot. Voici les variables à configurer :
   ```env
   TOKEN=your_discord_bot_token_here
   ID=your_discord_bot_id_here
   ```
> [!WARNING]
> Assurez-vous que ce fichier est placé à la racine du projet et que son contenu reste confidentiel. Ne partagez pas votre token, car il permet de contrôler votre bot. 

4. **Lancer le bot**
   ```bash
   node index.js
   ```

5. **Configurer le bot**
Le bot offre des commandes dédiées pour personnaliser son comportement directement depuis Discord :

- Configurez les salons pour les messages de motivation avec `/config motivation_channel`.
- Modifiez l'heure d'envoi des messages de motivation avec `/config set_default_motivation_hour`.
- Définissez le salon pour les notifications de séances avec `/config notif_channel`.
- Activez ou désactivez le message au démarrage avec `/config toggle_startup_message`.

Ces options vous permettent d'adapter facilement le bot aux besoins de votre serveur.


## Configuration

### Ajouter des Citations
1. Ouvrez le fichier `data/motivation.json`.
2. Ajoutez vos citations dans le tableau `"citations"` au format suivant :
   ```json
   {
       "citations": [
           "Soyez meilleur qu'hier.",
           "Chaque jour est une nouvelle opportunité."
       ]
   }
   ```
3. Relancez le bot pour appliquer les modifications.

![motivation](https://github.com/user-attachments/assets/434ee8a6-7657-4bae-ac91-45babf81bae4)

## Statistiques Personnalisées

Le bot propose des outils pour analyser vos performances et vos habitudes d’entraînement grâce à l’upload de données.
- **Upload des Données** : Utilisez `/upload` pour importer un fichier JSON (Basic Fit - My Data).
- **Visualisation** : Les commandes `/stats` permettent d'explorer vos habitudes sous forme de graphiques et de chiffres clés.

![serverstats](https://github.com/user-attachments/assets/d32faea6-0d68-422d-b627-b8f6fe045a53)

## Architecture du Projet

- **`commands/`** : Contient les commandes du bot.
    - **`basicfit/`** : Commandes spécifiques à l'analyse des données BasicFit (exemple : `/basicfit stats heatmap`, `/basicfit compare`).
    - **`calcul/`** : Commandes pour effectuer divers calculs liés à la musculation et au fitness (IMC, besoins caloriques, etc.).
    - **`config`** : Commandes pour configurer divers paramètres du bot (ID, heure, message).
- **`events/`** : Gère les événements Discord (comme les messages quotidiens).
- **`data/`** : Contient les fichiers JSON (citations, configurations, etc.).
- **`buttons/`** : Contient les gestionnaires des interactions avec les boutons.
- **`modals/`** : Contient les gestionnaires des interactions avec les modals.
- **`index.js`** : Point d'entrée principal.

## Dépendances

- [discord.js](https://discord.js.org/) : Bibliothèque pour interagir avec l’API Discord.
- [dotenv](https://www.npmjs.com/package/dotenv) : Gestion des variables d’environnement.
- [node-schedule](https://www.npmjs.com/package/node-schedule) : Planification des tâches répétitives.
- [canvas](https://www.npmjs.com/package/canvas) : Génération d'images personnalisées, comme les heatmaps.
- [date-fns-tz](https://www.npmjs.com/package/date-fns-tz) : Gestion des fuseaux horaires pour la planification.
- [undici](https://www.npmjs.com/package/undici) : Client HTTP moderne et performant pour effectuer des requêtes.

## Contribution

Les contributions sont bienvenues ! Voici comment vous pouvez contribuer :

1. Forkez le projet.
2. Créez une branche pour votre fonctionnalité :
   ```bash
   git checkout -b feature-ma-nouvelle-fonctionnalite
   ```
3. Commitez vos modifications :
   ```bash
   git commit -m "Ajout d'une nouvelle fonctionnalité"
   ```
4. Poussez votre branche :
   ```bash
   git push origin feature-ma-nouvelle-fonctionnalite
   ```
5. Ouvrez une pull request.

## Licence

Ce projet est sous licence MIT. Vous êtes libre de l’utiliser, de le modifier et de le redistribuer dans le respect des termes de la licence.

Pour plus de détails, consultez le fichier [LICENSE](./LICENSE).

