# Discord Bot - GoMuscu

Un bot Discord conçu pour fournir des citations de motivation quotidiennes et répondre aux commandes slash pour encourager les membres d'un serveur.

## Fonctionnalités

- **Commandes Slash :**
  - `/motivation` : Envoie une citation motivante aléatoire.

- **Message Quotidien :**
  - Envoie automatiquement une citation motivante tous les jours à 7h dans un canal spécifié.

## Prérequis

- [Node.js](https://nodejs.org/) version 16 ou supérieure.
- Un compte Discord avec accès au portail des développeurs.
- Permissions pour ajouter un bot à un serveur.

## Installation

1. **Cloner le dépôt :**
   ```bash
   git clone <URL_DU_DEPOT>
   cd <NOM_DU_DEPOT>
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Configurer le fichier `.env` :**
   Créez un fichier `.env` à la racine du projet et ajoutez votre token de bot Discord :
   ```env
   TOKEN=your_discord_bot_token_here
   ```

4. **Configurer les commandes :**
   Dans le fichier `index.js`, remplacez les valeurs par :
   - `clientId` : L'ID de votre bot (disponible sur le portail développeur Discord).
   - `guildId` : L'ID de votre serveur (obtenez-le en activant le mode développeur dans Discord).

5. **Démarrer le bot :**
   ```bash
   node index.js
   ```

## Ajouter des Citations

1. Ouvrez le fichier `data/motivation.json`.
2. Ajoutez vos propres citations au format suivant :
   ```json
   {
       "citations": [
           "Votre nouvelle citation ici.",
           "Une autre citation motivante."
       ]
   }
   ```

3. Relancez le bot pour appliquer les changements.

## Commandes Disponibles

| Commande       | Description                              |
|----------------|------------------------------------------|
| `/motivation`  | Envoie une citation motivante aléatoire. |

## Fonctionnalité Automatique

Le bot envoie une citation motivante chaque jour à 7h dans un canal spécifique. Pour configurer le canal :

1. Ouvrez le fichier `events/dailyMotivation.js`.
2. Remplacez `YOUR_CHANNEL_ID` par l'ID du canal souhaité.

## Dépendances

- `discord.js` : Pour l'interaction avec l'API Discord.
- `dotenv` : Pour gérer les variables d'environnement.
- `node-schedule` : Pour planifier l'envoi de messages quotidiens.

## Contribuer

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le dépôt.
2. Créez une branche pour votre fonctionnalité ou correction :
   ```bash
   git checkout -b ma-branche
   ```
3. Effectuez vos modifications et poussez la branche :
   ```bash
   git push origin ma-branche
   ```
4. Ouvrez une pull request.

## Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, de le modifier et de le redistribuer tant que vous respectez les termes de la licence.

