import bcrypt from 'bcrypt';
import User from '../models/User.js'; // Assurez-vous que le chemin est correct


// Middleware pour vérifier le rôle admin
const checkAdminRole = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé, vous n\'avez pas les permissions' });
  }
  next();
};

const getTopUsers = async (req, res) => {
  try {
    const users = await User.find().limit(10); // Récupérer les 10 premiers utilisateurs
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
};

// Créer un nouvel utilisateur
export const createUser = async (req, res) => {
  const { email, password, nom, prenom, code, telephone, role } = req.body;

  try {
    // Vérifier si l'email, le téléphone ou le code existent déjà
    const existingUser = await User.findOne({
      $or: [
        { email: email },
        { telephone: telephone },
        { code: code },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email, téléphone ou code déjà utilisé.',
      });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création d'un nouvel utilisateur
    const newUser = new User({
      email,
      password: hashedPassword,
      nom,
      prenom,
      code,
      telephone,
      role,
    });

    // Sauvegarde de l'utilisateur
    await newUser.save();

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: newUser._id,
        email: newUser.email,
        nom: newUser.nom,
        prenom: newUser.prenom,
        telephone: newUser.telephone,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: 'Une erreur est survenue lors de la création de l\'utilisateur',
      details: err.message,
    });
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

export default { createUser , getAllUsers, getUserById,updateUser,deleteUser,getTopUsers, checkAdminRole, };