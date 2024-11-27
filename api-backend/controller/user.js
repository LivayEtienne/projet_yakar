const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




// CREATE - Inscription d'un utilisateur
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)  // Hachage du mot de passe
    .then(hash => {
      const user = new User({
        prenom: req.body.prenom,
        nom: req.body.nom,
        telephone: req.body.telephone,
        code: req.body.code,
        email: req.body.email,
        password: hash,
        role: req.body.role || 'user'  // Rôle par défaut "user"
      });

      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé avec succès !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};



/********************************************************************************************************************************************** */





// READ - Obtenir un utilisateur par ID
exports.getUser = (req, res, next) => {
  const userId = req.params.id;  // Récupérer l'ID de l'utilisateur dans les paramètres de la requête
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé !' });
      }
      res.status(200).json(user);  // Renvoi de l'utilisateur sous forme JSON
    })
    .catch(error => res.status(500).json({ error }));
};







/****************************************************************************************************************************************** */





// READ - Obtenir tous les utilisateurs
exports.getAllUsers = (req, res, next) => {
  User.find()
    .then(users => {
      res.status(200).json(users);  // Renvoi de la liste de tous les utilisateurs
    })
    .catch(error => res.status(500).json({ error }));
};







/********************************************************************************************************************************************* */



// UPDATE - Modifier un utilisateur par ID
exports.updateUser = (req, res, next) => {
  const userId = req.params.id;

  // On construit l'objet de mise à jour avec les champs envoyés dans la requête
  const updatedUser = {
    prenom: req.body.prenom,
    nom: req.body.nom,
    telephone: req.body.telephone,
    code: req.body.code,
    email: req.body.email,
    role: req.body.role || 'user', // Rôle par défaut "user"
  };

  // Si le mot de passe est mis à jour, on le hache avant
  if (req.body.password) {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        updatedUser.password = hash; // On met à jour le mot de passe haché
        checkEmailAndPhone();
      })
      .catch(error => res.status(500).json({ error }));
  } else {
    checkEmailAndPhone();
  }

  function checkEmailAndPhone() {
    // Vérifie si l'email existe déjà dans la base de données
    User.findOne({ email: req.body.email })
      .then(existingEmailUser => {
        if (existingEmailUser && existingEmailUser._id.toString() !== userId) {
          return res.status(400).json({ message: 'Veuillez réessayer avec un autre email.' });
        }

        // Vérifie si le téléphone existe déjà dans la base de données
        User.findOne({ telephone: req.body.telephone })
          .then(existingPhoneUser => {
            if (existingPhoneUser && existingPhoneUser._id.toString() !== userId) {
              return res.status(400).json({ message: 'Veuillez réessayer avec un autre numéro de téléphone.' });
            }

            // Si tout est bon, mise à jour
            updateInDb();
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  }

  function updateInDb() {
    // Mise à jour de l'utilisateur dans la base de données
    User.findByIdAndUpdate(userId, updatedUser, { new: true })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé !' });
        }
        res.status(200).json({ message: 'Utilisateur mis à jour avec succès !', user });
      })
      .catch(error => res.status(500).json({ error }));
  }
};






/***************************************************************************************************************************** */







// DELETE - Supprimer un utilisateur par ID
exports.deleteUser = (req, res, next) => {
  const userId = req.params.id;  // Récupérer l'ID de l'utilisateur dans les paramètres de la requête

  User.findByIdAndDelete(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé !' });
      }
      res.status(200).json({ message: 'Utilisateur supprimé avec succès !' });
    })
    .catch(error => res.status(500).json({ error }));
};






/*********************************************************************************************************************** */





exports.loginCode = (req, res, next) => {
  const { code } = req.body;  // L'utilisateur envoie uniquement le code

  if (!code) {
      return res.status(400).json({ error: 'Code requis' });
  }

  // Recherche de l'utilisateur par code
  User.findOne({ code: code })
      .then(user => {
          if (!user) {
              return res.status(401).json({ error: 'Code incorrect' });
          }

          // Si le code est correct, génération du token
          const token = jwt.sign(
              { userId: user._id },  // Données à inclure dans le token (ID de l'utilisateur)
              'RANDOM_TOKEN_SECRET',  // Clé secrète pour signer le token
              { expiresIn: '2h' }    // Durée de validité du token (2 heures)
          );

          // Définir le token dans un cookie
          res.cookie('authToken', token, {
              httpOnly: true,      // Empêche l'accès au cookie via JavaScript
              secure: process.env.NODE_ENV === 'production', // Si l'environnement est production, alors cookie sécurisé (HTTPS)
              sameSite: 'strict',  // Empêche l'envoi du cookie dans les requêtes cross-site
              maxAge: 2 * 60 * 60 * 1000  // Durée de validité du cookie (2 heures)
          });

          // Réponse avec le rôle de l'utilisateur
          return res.status(200).json({
              message: `Bienvenue ${user.role === 'admin' ? 'Admin' : 'User'} !`,
              userId: user._id,
              role: user.role
          });
      })
      .catch(error => res.status(500).json({ error }));
};
/************************************************************************************************************************** */


exports.archive =(req, res) => {
  const userId = req.params.id;

  // Chercher l'utilisateur par ID
  User.findById(userId)
      .then(user => {
          if (!user) {
              return res.status(404).json({ message: 'Utilisateur non trouvé' });
          }

          // Basculer la valeur du champ 'archive'
          user.archive = !user.archive;  // Si archive est false, il sera mis à true et vice versa

          // Sauvegarder les modifications dans la base de données
          user.save()
              .then(updatedUser => {
                  res.status(200).json({
                      message: `Utilisateur ${updatedUser.archive ? 'archivé' : 'désarchivé'} avec succès`,
                      user: updatedUser
                  });
              })
              .catch(error => {
                  res.status(500).json({ error });
              });
      })
      .catch(error => {
          res.status(500).json({ error });
      });
};






exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
      .then(user => {
          if (!user) {
              return res.status(401).json({ error: 'Utilisateur non trouvé !' });
          }
          bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                  if (!valid) {
                      return res.status(401).json({ error: 'Mot de passe incorrect !' });
                  }

                  const token = jwt.sign(
                      { userId: user._id },
                      'RANDOM_TOKEN_SECRET',
                      { expiresIn: '2h' }
                  );

                  // Enregistrement du token sous forme de cookie sécurisé
                  res.cookie('authToken', token, {
                      httpOnly: true,       // Empêche l'accès JavaScript pour plus de sécurité
                      secure: true,         // Activez en production avec HTTPS
                      maxAge: 2 * 60 * 60 * 1000, // Durée de vie : 2 heures
                      sameSite: 'strict'    // Empêche les attaques CSRF
                  });

                  res.status(200).json({
                      message: `Bienvenue ${user.role === 'admin' ? 'Admin' : 'User'} !`,
                      userId: user._id,
                      role: user.role
                  });
              })
              .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};



exports.logout = (req, res, next) => {
  res.clearCookie('authToken'); // Supprime le cookie authToken
  res.status(200).json({ message: 'Déconnexion réussie !' });
};













/************************************************************************************************************************************************ */  
  


exports.updateRole = (req, res) => {
    const userId = req.params.id;
  
    // Trouver l'utilisateur par ID
    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
  
        // Basculer le rôle
        user.role = user.role === 'admin' ? 'user' : 'admin';
        
        return user.save(); // Retourne une promesse pour sauvegarder l'utilisateur
      })
      .then((updatedUser) => {
        // Réponse après la sauvegarde
        res.status(200).json({
          message: 'Rôle mis à jour avec succès',
          updatedRole: updatedUser.role,
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du rôle' });
      });
  };
  
