import express from 'express';
import mesureController from '../controllers/mesureController.js';
import parametreController from '../controllers/parametreController.js';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';
import { authMiddleware,  checkAdminRole} from '../middleware/auth.js';

//const { authMiddleware, checkAdminRole } = require('../middleware/auth.js') ;
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Mesures
 *   description: Gestion des mesures de température et d'humidité enregistrées à 10h, 14h, et 17h, par jour et par semaine
 */

/**
 * @swagger
 * /mesures:
 *   post:
 *     summary: Ajouter une mesure de température et d'humidité
 *     tags: [Mesures]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               temperature:
 *                 type: number
 *                 example: 23.5
 *               humidite:
 *                 type: number
 *                 example: 65
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date et heure de la mesure (10h, 14h, ou 17h)
 *                 example: "2024-11-18T10:00:00Z"
 *     responses:
 *       201:
 *         description: Mesure ajoutée avec succès
 *       400:
 *         description: Erreur dans la demande
 */

/**
 * @swagger
 * /mesures:
 *   get:
 *     summary: Récupérer les mesures de température et d'humidité
 *     tags: [Mesures]
 *     responses:
 *       200:
 *         description: Liste des mesures pour chaque jour de la semaine
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: Date de la mesure
 *                     example: "2024-11-18"
 *                   temperature:
 *                     type: object
 *                     properties:
 *                       "10h":
 *                         type: number
 *                         example: 23.5
 *                       "14h":
 *                         type: number
 *                         example: 25.0
 *                       "17h":
 *                         type: number
 *                         example: 22.0
 *                   humidite:
 *                     type: object
 *                     properties:
 *                       "10h":
 *                         type: number
 *                         example: 60
 *                       "14h":
 *                         type: number
 *                         example: 62
 *                       "17h":
 *                         type: number
 *                         example: 58
 */

/**
 * @swagger
 * /mesures/hebdomadaire:
 *   get:
 *     summary: Récupérer les moyennes hebdomadaires de température et d'humidité
 *     tags: [Mesures]
 *     responses:
 *       200:
 *         description: Moyennes hebdomadaires
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 temperature:
 *                   type: object
 *                   properties:
 *                     moyenne:
 *                       type: number
 *                       example: 24.5
 *                     maximum:
 *                       type: number
 *                       example: 28.0
 *                     minimum:
 *                       type: number
 *                       example: 21.0
 *                 humidite:
 *                   type: object
 *                   properties:
 *                     moyenne:
 *                       type: number
 *                       example: 62
 *                     maximum:
 *                       type: number
 *                       example: 70
 *                     minimum:
 *                       type: number
 *                       example: 55
 */

/**
 * @swagger
 * /historique:
 *   get:
 *     summary: Récupérer l'historique journalier des mesures
 *     tags: [Mesures]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-11-18"
 *     responses:
 *       200:
 *         description: Liste des mesures pour une journée spécifique
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 temperature:
 *                   type: object
 *                   properties:
 *                     "10h":
 *                       type: number
 *                       example: 23.0
 *                     "14h":
 *                       type: number
 *                       example: 25.5
 *                     "17h":
 *                       type: number
 *                       example: 22.3
 *                 humidite:
 *                   type: object
 *                   properties:
 *                     "10h":
 *                       type: number
 *                       example: 60
 *                     "14h":
 *                       type: number
 *                       example: 62
 *                     "17h":
 *                       type: number
 *                       example: 59
 */

/**
 * @swagger
 * /historique/heure:
 *   get:
 *     summary: Récupérer les mesures d'une heure spécifique
 *     tags: [Mesures]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-11-18"
 *       - in: query
 *         name: heure
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["10h", "14h", "17h"]
 *           example: "10h"
 *     responses:
 *       200:
 *         description: Mesures pour une heure donnée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 temperature:
 *                   type: number
 *                   example: 22.5
 *                 humidite:
 *                   type: number
 *                   example: 58
 *       400:
 *         description: Erreur dans la demande
 */

/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: Gestion de l'authentification des utilisateurs
 */

/**
 * @swagger
 * /login-email:
 *   post:
 *     summary: Authentifier un utilisateur via email et mot de passe
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Adresse email de l'utilisateur
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *                 example: "your_password"
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT généré après authentification
 *                   example: "votre_token_jwt"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64c23c0f7b1e4b26b1c9dfea"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       example: "user"
 *       400:
 *         description: Requête mal formée (email ou mot de passe manquant)
 *       401:
 *         description: Identifiants invalides
 */

/**
 * @swagger
 * /login-code:
 *   post:
 *     summary: Authentifier un utilisateur via code secret
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codeSecret:
 *                 type: string
 *                 description: Code secret de l'utilisateur
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT généré après authentification
 *                   example: "votre_token_jwt"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64c23c0f7b1e4b26b1c9dfea"
 *                     role:
 *                       type: string
 *                       example: "user"
 *       400:
 *         description: Requête mal formée (code secret manquant)
 *       401:
 *         description: Identifiants invalides
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Déconnecter un utilisateur
 *     tags: [Authentification]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       400:
 *         description: Token requis
 */

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /utilisateurs:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "your_password"
 *               nom:
 *                 type: string
 *                 example: "Nom"
 *               prenom:
 *                 type: string
 *                 example: "Prenom"
 *               code:
 *                 type: string
 *                 example: "1234"
 *               telephone:
 *                 type: string
 *                 example: "0123456789"
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       403:
 *         description: Accès refusé, rôle administrateur requis
 */

/**
 * @swagger
 * /utilisateurs:
 *   get:
 *     summary: Récupérer les 10 premiers utilisateurs
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des 10 premiers utilisateurs
 *       403:
 *         description: Accès refusé, rôle administrateur requis
 */

/**
 * @swagger
 * /utilisateurs/{id}:
 *   get:
 *     summary: Lire un utilisateur spécifique par ID
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 *       403:
 *         description: Accès refusé, rôle administrateur requis
 */

/**
 * @swagger
 * /utilisateurs/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "new_password"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       403:
 *         description: Accès refusé, rôle administrateur requis
 */

/**
 * @swagger
 * /utilisateurs/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       403:
 *         description: Accès refusé, rôle administrateur requis
 */

// Routes des mesures
router.post('/mesures', mesureController.addMesure);
router.get('/mesures', mesureController.getMesures);

// Routes des paramètres
router.get('/parametres', parametreController.getParametres);
router.put('/parametres', parametreController.updateParametres);

// Routes pour l'historique
router.get('/historique', mesureController.getHistorique);
router.get('/historique/heure', mesureController.getHistoriqueParHeure);
router.get('/historique/semaine', mesureController.getHistoriqueParSemaine);

// Routes d'authentification

router.post('/logout', authController.logout);
// Connexion par email et mot de passe
router.post('/login/email', authController.loginWithEmail);

// Connexion par code secret
router.post('/login/code', authController.loginWithCode);

// Routes pour les utilisateurs - uniquement pour les admins
router.post('/utilisateurs', authMiddleware,checkAdminRole,userController.createUser);
router.get('/utilisateurs', authMiddleware, checkAdminRole, userController.getAllUsers);
router.get('/utilisateurs/:id', authMiddleware, checkAdminRole, userController.getUserById);
router.put('/utilisateurs/:id', authMiddleware, checkAdminRole, userController.updateUser);
router.delete('/utilisateurs/:id', authMiddleware, checkAdminRole, userController.deleteUser);

// Exporter le router par défaut
export default router;