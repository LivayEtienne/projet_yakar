const express = require('express');
const router = express.Router();
const Temperature = require('../models/Temperature'); // Importer le modèle

// Route pour récupérer toutes les données de température
router.get('/temperatures', async (req, res) => {
  try {
    const temperatures = await Temperature.find(); // Récupérer toutes les entrées
    res.status(200).json(temperatures); // Retourner les données sous forme de JSON
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des températures', error: error.message });
  }
});

// Route POST pour ajouter de nouvelles données de température et d'humidité
router.post('/ajout_temp', async (req, res) => {
    try {
      // Récupérer les données envoyées dans le corps de la requête
      const { temperature, humidity } = req.body;
  
      // Créer un nouveau document de température
      const newTemperature = new Temperature({
        temperature,
        humidity
      });
  
      // Sauvegarder dans la base de données
      await newTemperature.save();
  
      // Répondre avec un message de succès
      res.status(201).json({ message: 'Données de température et d\'humidité ajoutées avec succès', data: newTemperature });
    } catch (error) {
      console.error('Erreur lors de l\'insertion des données :', error);
      res.status(500).json({ message: 'Erreur lors de l\'insertion des données', error: error.message });
    }
  });

  router.get('/average/:date', async (req, res) => {
    try {
      const dateParam = req.params.date;  // La date passée en paramètre sous le format YYYY-MM-DD
  
      // Utiliser la méthode statique `calculateDailyAverage` pour obtenir la moyenne des températures
      const averageTemperature = await Temperature.calculateDailyAverage(dateParam);
  
      if (averageTemperature === null) {
        return res.status(404).json({ message: 'Aucune donnée disponible pour cette date.' });
      }
  
      // Filtrer les températures pour la même date pour obtenir la moyenne de l'humidité également
      const startOfDay = new Date(dateParam);
      startOfDay.setHours(0, 0, 0, 0); // Début de la journée (minuit)
      
      const endOfDay = new Date(dateParam);  // Fin de la journée (23h59)
      endOfDay.setHours(23, 59, 59, 999);
  
      // Récupérer toutes les températures pour cette date afin de calculer l'humidité moyenne
      const temperatures = await Temperature.find({
        date: { $gte: startOfDay, $lte: endOfDay }
      });
  
      const averageHumidity = temperatures.reduce((acc, temp) => acc + temp.humidity, 0) / temperatures.length;
  
      return res.status(200).json({
        date: dateParam,
        averageTemperature: averageTemperature,
        averageHumidity: averageHumidity
      });
  
    } catch (error) {
      console.error('Erreur lors du calcul de la moyenne :', error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  });
  
  


  // Route pour lister l'historique des températures et humidités
router.get('/temperatures/historique', async (req, res) => {
    try {
      const { startDate, endDate } = req.query; // Récupérer les éventuels filtres
  
      let filter = {}; // Filtre vide par défaut
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }
  
      // Récupérer et trier les données
      const temperatures = await Temperature.find(filter).sort({ date: -1 });
  
      // Retourner les données sous forme de JSON
      res.status(200).json(temperatures);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique :', error);
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique', error: error.message });
    }
  });

  // Route pour récupérer les données filtrées par période
router.get('/temperatures/filter', async (req, res) => {
    try {
        const { period } = req.query;  // Période : 'weekly' ou 'monthly'
        const now = new Date();
        let startDate, endDate;

        if (period === 'weekly') {
            startDate = new Date(now.setDate(now.getDate() - now.getDay()));  // Début de la semaine
            endDate = new Date(now.setDate(now.getDate() + 6));  // Fin de la semaine
        } else if (period === 'monthly') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);  // Début du mois
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);  // Fin du mois
        } else {
            return res.status(400).json({ message: "Période invalide" });
        }

        // Récupérer les données filtrées par période
        const filteredTemperatures = await Temperature.find({
            date: { $gte: startDate, $lte: endDate }
        });

        res.status(200).json(filteredTemperatures);
    } catch (error) {
        console.error('Erreur lors du filtrage des températures :', error);
        res.status(500).json({ message: 'Erreur lors du filtrage des données', error: error.message });
    }
});

router.get('/week-history', async (req, res) => {
  try {
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay(); // Jour de la semaine (0 = Dimanche, 1 = Lundi, etc.)

    // Calculer la date du dernier lundi (début de la semaine)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek + 1); // Revenir au lundi
    startOfWeek.setHours(0, 0, 0, 0); // Minuit du lundi

    // Calculer la date du dimanche (fin de la semaine)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Ajouter 6 jours pour atteindre le dimanche
    endOfWeek.setHours(23, 59, 59, 999); // 23h59 du dimanche

    // Récupérer les températures entre le lundi et le dimanche
    const temperatures = await Temperature.find({
      date: { $gte: startOfWeek, $lte: endOfWeek }
    });

    if (temperatures.length === 0) {
      return res.status(404).json({ message: 'Aucune donnée disponible pour cette semaine.' });
    }

    // Organiser les températures par jour
    const weeklyData = [];
    for (let i = 0; i <= 6; i++) {
      const dayStart = new Date(startOfWeek);
      dayStart.setDate(startOfWeek.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      // Filtrer les températures pour ce jour
      const dailyTemps = temperatures.filter(temp => temp.date >= dayStart && temp.date <= dayEnd);
      const dailyAvgTemp = dailyTemps.reduce((acc, temp) => acc + temp.temperature, 0) / dailyTemps.length || 0;
      const dailyAvgHumidity = dailyTemps.reduce((acc, temp) => acc + temp.humidity, 0) / dailyTemps.length || 0;

      weeklyData.push({
        day: dayStart.toLocaleString('fr-FR', { weekday: 'long' }), // Nom du jour (Lundi, Mardi, ...)
        date: dayStart,
        averageTemperature: dailyAvgTemp,
        averageHumidity: dailyAvgHumidity
      });
    }

    return res.status(200).json(weeklyData);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});


  
module.exports = router;
