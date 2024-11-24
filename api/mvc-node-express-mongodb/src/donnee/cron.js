// utils/cron.js
const cron = require('node-cron');
const Temperature = require('../models/Temperature');

// Fonction de collecte des données à des heures spécifiques
const collectData = () => {
  // Collecte les données à 10h00, 14h00, 17h00 tous les jours
  cron.schedule('0 10,14,17 * * *', async () => {
    try {
      // Simuler la collecte de données
      const temperature = Math.random() * 30;  // Exemple de température aléatoire
      const humidity = Math.random() * 100;  // Exemple d'humidité aléatoire

      // Enregistrer ces données dans la base de données
      const newData = new Temperature({ temperature, humidity });
      await newData.save();
      console.log('Données collectées et enregistrées:', newData);
    } catch (error) {
      console.error('Erreur lors de la collecte de données:', error);
    }
  });
};

// Exporter la fonction collectData
module.exports = { collectData };
