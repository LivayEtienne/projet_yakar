const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Pour hasher le mot de passe

// Schéma pour l'utilisateur
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,  // L'email doit être unique
    match: /.+\@.+\..+/  // Validation pour le format de l'email
  },
  mot_de_passe: {
    type: String,
    required: true  // Le mot de passe est obligatoire
  },
  role: {
    type: String,
    enum: ['super-admin', 'utilisateur-simple'], // Définir les rôles disponibles
    default: 'utilisateur-simple' // Rôle par défaut
  },
  archived: {
    type: Boolean,
    default: false,  // Par défaut, un utilisateur n'est pas archivé
  },
});

// Hacher le mot de passe avant de sauvegarder l'utilisateur
userSchema.pre('save', async function(next) {
  if (!this.isModified('mot_de_passe')) return next();  // Si le mot de passe n'est pas modifié, on continue
  const salt = await bcrypt.genSalt(10);  // Créer un "salt" pour le hachage
  this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);  // Hacher le mot de passe
  next();
});

// Créer un modèle User
const User = mongoose.model('User', userSchema);

module.exports = User;
