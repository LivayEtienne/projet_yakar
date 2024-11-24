import mongoose from 'mongoose';
import { MesureModel } from './models/MesureModel'; // Remplacez ce chemin par le bon chemin du modèle

// Fonction pour récupérer les dernières données de température et d'humidité
export const getLatestTemperatureData = async () => {
  try {
    // Recherche des dernières données de température et humidité triées par timestamp décroissant
    const latestData = await MesureModel.findOne().sort({ timestamp: -1 });

    if (!latestData) {
      console.log('Aucune donnée trouvée.');
      return null;
    }

    console.log('Dernières données de température et humidité:', latestData);
    return latestData; // Retourne les dernières données
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error.message);
    throw error;
  }
};

// Exemple d'utilisation dans une route ou autre partie du code
const fetchTemperatureData = async () => {
  const data = await getLatestTemperatureData();
  if (data) {
    console.log('Température:', data.temperature, 'Humidité:', data.humidity);
  } else {
    console.log('Aucune donnée disponible.');
  }
};

// Vous pouvez appeler cette fonction pour récupérer les données dans n'importe quelle autre partie de votre code
fetchTemperatureData();
