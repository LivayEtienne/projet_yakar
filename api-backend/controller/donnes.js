const Donne = require('../models/donnes'); // Importer le modèle

// Création d'une nouvelle donnée
exports.createDonne = (req, res, next) => {
  const donne = new Donne({
    temperature: req.body.temperature,
    humidite: req.body.humidite,
    date: req.body.date || Date.now(), // Ajoute la date actuelle par défaut si elle n'est pas fournie
  });

  donne.save()
    .then(() => res.status(201).json({ message: 'Donnée enregistrée !' }))
    .catch(error => res.status(400).json({ error }));
};



// Récupération d'une donnée par son ID
exports.getOneDonne = (req, res, next) => {
  Donne.findOne({ _id: req.params.id })
    .then(donne => res.status(200).json(donne))
    .catch(error => res.status(404).json({ error }));
};



// Modification d'une donnée existante
exports.modifyDonne = (req, res, next) => {
  const donneObject = { ...req.body }; // Contient les nouvelles valeurs à mettre à jour

  Donne.updateOne({ _id: req.params.id }, { ...donneObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Donnée modifiée !' }))
    .catch(error => res.status(400).json({ error }));
};



// Suppression d'une donnée
exports.deleteDonne = (req, res, next) => {
  Donne.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Donnée supprimée !' }))
    .catch(error => res.status(400).json({ error }));
};



// Récupération de toutes les données
exports.getAllDonnes = (req, res, next) => {
  Donne.find()
    .then(donnes => res.status(200).json(donnes))
    .catch(error => res.status(400).json({ error }));
};







