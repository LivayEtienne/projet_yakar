// controllers/parametreController.js
import Parametre from '../models/Parametre.js';

// Récupérer les paramètres
const getParametres = async (req, res) => {
  try {
    const param = await Parametre.findOne();
    res.status(200).json(param);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour les paramètres
const updateParametres = async (req, res) => {
  try {
    const { temperatureMax } = req.body;

    const param = await Parametre.findOne();
    param.temperatureMax = temperatureMax || param.temperatureMax;
    await param.save();

    res.status(200).json({ message: 'Paramètres mis à jour', param });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Exporter les fonctions par défaut
export default { getParametres, updateParametres };