import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret';


// Inscription
const register = async (req, res) => {
  const { email, password, code, telephone } = req.body; 
  if (!email || !password || !code || !telephone) { 
    return res.status(400).json({ message: 'Email, mot de passe, code et téléphone sont requis' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email déjà utilisé' });

    const existingCode = await User.findOne({ code });
    if (existingCode) return res.status(400).json({ message: 'Code secret déjà utilisé' });

    const existingPhone = await User.findOne({ telephone });
    if (existingPhone) return res.status(400).json({ message: 'Numéro de téléphone déjà utilisé' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, code, telephone });
    await newUser.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Connexion par email et mot de passe
const loginWithEmail = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe sont requis' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
  
      const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "8h" }
      );
      
      res.cookie('token', token, {
        httpOnly: true, // Empêche l'accès au cookie depuis JavaScript côté client
        secure: false,  // Passez à true en production pour HTTPS
        sameSite: 'strict', // Empêche les requêtes CSRF (l'accès cross-site)
        maxAge: 8 * 60 * 60 * 1000 // Expire dans 72 heures
      });
    res.status(200).json({ message: 'Connexion réussie', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Connexion par code secret
const loginWithCode = async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ message: 'Le code secret est requis' });
  }
  try {
    const user = await User.findOne({ code });
    if (!user) {
      return res.status(401).json({ message: 'Code secret invalide' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.cookie('token', token, {
      httpOnly: true, // Empêche l'accès au cookie depuis JavaScript côté client
      secure: false,  // Passez à true en production pour HTTPS
      sameSite: 'strict', // Empêche les requêtes CSRF (l'accès cross-site)
      maxAge: 8 * 60 * 60 * 1000 // Expire dans 72 heures
    });

    res.status(200).json({ message: 'Connexion réussie', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Déconnexion
const logout = (req, res) => {
  try {
    // Effacer le cookie authToken
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS en production
      sameSite: 'strict',
    });
    return res.status(200).json({ msg: 'Déconnexion réussie' });
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
  }
}

export default { register, loginWithEmail, logout, loginWithCode };