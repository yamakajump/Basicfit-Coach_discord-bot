# Discord Bot - GoMuscu

Un bot Discord conçu pour fournir des outils liés à la musculation, des calculs nutritionnels, des citations de motivation et bien plus encore pour encourager les membres d'un serveur à atteindre leurs objectifs.

## Fonctionnalités

### **Commandes Slash**
Le bot propose plusieurs commandes pour aider les utilisateurs :

| Commande       | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| `/motivation`  | Envoie une citation motivante aléatoire.                                   |
| `/imc`         | Calcule l'indice de masse corporelle (IMC) en fonction du poids et de la taille. |
| `/bodyfat`     | Estime le pourcentage de masse grasse à partir de plusieurs paramètres.    |
| `/calories`    | Calcule les besoins caloriques journaliers en fonction de l'activité.      |
| `/macro`       | Propose une répartition des macronutriments selon les besoins caloriques.  |
| `/fatloss`     | Estime le déficit calorique nécessaire pour atteindre un poids cible.      |
| `/maxrp`       | Calcule le poids maximum pour une répétition (1RM).                       |
| `/energyburn`  | Estime les calories brûlées en fonction de l'activité et de la durée.      |
| `/birthday`    | Enregistre et affiche les anniversaires des membres du serveur.           |
| `/clear`       | Supprime un certain nombre de messages dans un canal.                     |
| `/mute`        | Attribue un rôle "mute" à un utilisateur.                                |
| `/unmute`      | Retire le rôle "mute" d'un utilisateur.                                   |

### **Messages quotidiens**
- Le bot envoie une citation motivante chaque jour à 7h dans un canal spécifique.

---

## Prérequis

- [Node.js](https://nodejs.org/) version 16 ou supérieure.
- Un compte Discord avec accès au portail des développeurs.
- Permissions pour ajouter un bot à un serveur.

---

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

---

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

---

## Configuration des Messages Automatiques

Le bot envoie une citation motivante chaque jour à une heure spécifique dans un canal.

1. Ouvrez le fichier `events/dailyMotivation.js`.
2. Remplacez `YOUR_CHANNEL_ID` par l'ID du canal souhaité.
3. Ajustez l'heure dans le planificateur pour correspondre à vos besoins.

---

## Dépendances

- `discord.js` : Pour l'interaction avec l'API Discord.
- `dotenv` : Pour gérer les variables d'environnement.
- `node-schedule` : Pour planifier l'envoi de messages quotidiens.

---

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

---

## Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, de le modifier et de le redistribuer tant que vous respectez les termes de la licence.  
Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

