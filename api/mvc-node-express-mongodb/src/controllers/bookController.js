const Data = require('../models/book');  // Importer le modèle Data

exports.createData = async (req, res) => {
    try {
      // Vérification des champs avant de créer l'objet
      const { email, mot_de_passe, temperature, humidity } = req.body;
      console.log(email, mot_de_passe, temperature, humidity)
      if (!email || !mot_de_passe || !temperature || !humidity) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
      }
  
      // Créer un objet Data avec les données envoyées
      const data = new Data(req.body);
  
      // Sauvegarder dans la base de données
      const savedData = await data.save();
  
      // Retourner la réponse avec les données sauvegardées
      res.status(201).json(savedData);
    } catch (error) {
      // Gérer l'erreur si une erreur de validation Mongoose ou autre se produit
      console.error('Erreur lors de la sauvegarde:', error);
      res.status(500).json({ error: error.message });
    }
  };
  
      
// Récupérer toutes les données (GET)
exports.getAllData = async (req, res) => {
  try {
    // Trouver toutes les entrées dans la collection Data
    const data = await Data.find();
    
    // Retourner la liste des données
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer une donnée spécifique par son ID (GET)
exports.getDataById = async (req, res) => {
  try {
    const { id } = req.params;  // Récupérer l'ID depuis les paramètres de la route
    
    // Trouver la donnée par ID
    const data = await Data.findById(id);
    
    if (!data) {
      return res.status(404).json({ message: 'Donnée non trouvée' });
    }
    
    // Retourner la donnée trouvée
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour une donnée spécifique (PUT)
exports.updateData = async (req, res) => {
  try {
    const { id } = req.params;  // Récupérer l'ID depuis les paramètres de la route
    
    // Mettre à jour la donnée avec l'ID donné
    const updatedData = await Data.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedData) {
      return res.status(404).json({ message: 'Donnée non trouvée' });
    }
    
    // Retourner la donnée mise à jour
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une donnée spécifique (DELETE)
exports.deleteData = async (req, res) => {
  try {
    const { id } = req.params;  // Récupérer l'ID depuis les paramètres de la route
    
    // Supprimer la donnée avec l'ID donné
    const deletedData = await Data.findByIdAndDelete(id);
    
    if (!deletedData) {
      return res.status(404).json({ message: 'Donnée non trouvée' });
    }
    
    // Retourner la confirmation de la suppression
    res.status(200).json({ message: 'Donnée supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
