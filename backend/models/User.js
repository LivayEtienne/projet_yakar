// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email:{ type: String, required: true, maxlength: 200 ,unique:true},
  password:{ type: String, required: true, maxlength: 200 },
  nom: { type: String, required: true, maxlength: 20 },
  prenom: { type: String, required: true, maxlength: 20 },
  code: { type: Number, required: true,unique:true },
  telephone: { type: Number, required: true ,unique:true},
  role: { type: String, enum: ['admin', 'user'], required: true },
  archived: { type: Boolean, default: false },
  dateCreation: { type: Date, default: Date.now },
  dateModification: { type: Date },
  dateArchivage: { type: Date }
});
// Créer un nouvel utilisateur
export const createUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lire tous les utilisateurs
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclure le mot de passe
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lire un utilisateur spécifique par ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id, '-password'); // Exclure le mot de passe
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  try {
    const updates = {};
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Utilisateur mis à jour avec succès', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export default mongoose.model('User', userSchema);