// controllers/mesureController.js
import Mesure from '../models/Mesure.js';
import Parametre from '../models/Parametre.js';

// Ajouter une mesure
const addMesure = async (req, res) => {
  try {
    const { temperature, humidite } = req.body;

    // Enregistrer la mesure
    const newMesure = new Mesure({ temperature, humidite });
    await newMesure.save();

    // Vérifier les seuils de température
    const param = await Parametre.findOne();
    if (temperature > param.temperatureMax) {
      param.etatVentilateur = true;
      param.etatBuzzer = true;
    } else {
      param.etatVentilateur = false;
      param.etatBuzzer = false;
    }
    await param.save();

    res.status(201).json({ message: 'Mesure ajoutée avec succès', mesure: newMesure });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer l'historique des mesures par semaine
const getHistoriqueParSemaine = async (req, res) => {
  const { startDate, endDate } = req.query; // Format attendu: "YYYY-MM-DD"

  try {
    // Vérification des paramètres de date
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Les dates de début et de fin sont requises.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Vérification si les dates sont valides
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Format de date invalide. Utilisez le format YYYY-MM-DD.' });
    }

    // Assurez-vous que la date de début est antérieure à la date de fin
    if (start >= end) {
      return res.status(400).json({ error: 'La date de début doit être antérieure à la date de fin.' });
    }

    const result = await Mesure.aggregate([
      {
        $match: {
          date: {
            $gte: start,
            $lt: end,
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" }, // Inclure l'année pour éviter les conflits
            week: { $week: "$date" }, // Groupement par semaine
          },
          avgTemperature: { $avg: "$temperature" },
          avgHumidite: { $avg: "$humidite" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.week": 1 } // Tri par année puis par semaine
      }
    ]);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer les mesures
const getMesures = async (req, res) => {
  try {
    const mesures = await Mesure.find().sort({ date: -1 }); // Dernières mesures en premier
    res.status(200).json(mesures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer l'historique des mesures par jour
const getHistorique = async (req, res) => {
  const { date } = req.query; // Format attendu: "YYYY-MM-DD"

  try {
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1); // Inclure la journée entière

    const mesures = await Mesure.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).sort({ date: 1 }); // Tri par date croissante

    res.status(200).json(mesures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer les mesures agrégées par heure
const getHistoriqueParHeure = async (req, res) => {
  const { date } = req.query; // Format attendu: "YYYY-MM-DD"

  try {
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1); // Inclure la journée entière

    const result = await Mesure.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $hour: "$date" },
          avgTemperature: { $avg: "$temperature" },
          avgHumidite: { $avg: "$humidite" },
        },
      },
      {
        $sort: { _id: 1 } // Trie par heure
      }
    ]);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Exporter les fonctions par défaut
export default { addMesure, getMesures, getHistorique, getHistoriqueParHeure, getHistoriqueParSemaine };