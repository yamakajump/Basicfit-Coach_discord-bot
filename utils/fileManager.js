const fs = require('fs');
const path = require('path');

/**
 * Charge un fichier JSON. Si le fichier n'existe pas, initialise avec une valeur par défaut.
 * @param {string} filePath - Chemin du fichier à charger.
 * @param {Object} defaultValue - Valeur par défaut à utiliser si le fichier n'existe pas.
 * @returns {Object} - Contenu du fichier JSON.
 */
function loadJson(filePath, defaultValue = {}) {
    try {
        if (!fs.existsSync(filePath)) {
            saveJson(filePath, defaultValue); // Sauvegarder la valeur par défaut si le fichier n'existe pas
            return defaultValue;
        }
        const rawData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error(`Erreur lors du chargement du fichier JSON : ${filePath}`, error);
        return defaultValue;
    }
}

/**
 * Sauvegarde un objet dans un fichier JSON.
 * @param {string} filePath - Chemin du fichier à sauvegarder.
 * @param {Object} data - Données à sauvegarder.
 */
function saveJson(filePath, data) {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Créer le dossier si nécessaire
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    } catch (error) {
        console.error(`Erreur lors de la sauvegarde du fichier JSON : ${filePath}`, error);
    }
}

module.exports = {
    loadJson,
    saveJson,
};
