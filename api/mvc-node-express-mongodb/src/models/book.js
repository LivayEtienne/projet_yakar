const mongoose = require('mongoose');

const bcrypt = require('bcryptjs'); // Importer bcrypt
// Définir le schéma pour les données
const dataSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,  // Le champ email est obligatoire
    match: /.+\@.+\..+/  // Validation pour le format de l'email
  },
  mot_de_passe: {
    type: String,
    required: true  // Le mot de passe est obligatoire
  },
  temperature: {
    type: Number,
    required: true  // La température est obligatoire
  },
  humidity: {
    type: Number,
    required: true  // L'humidité est obligatoire
  }
});

// Avant de sauvegarder l'utilisateur, hachons son mot de passe
dataSchema.pre('save', async function(next) {
    if (!this.isModified('mot_de_passe')) return next();  // Si le mot de passe n'est pas modifié, on continue
    const salt = await bcrypt.genSalt(10);  // Créer un "salt" pour le hachage
    this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);  // Hacher le mot de passe
    next();
  });
  

// Créer un modèle à partir du schéma
const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
