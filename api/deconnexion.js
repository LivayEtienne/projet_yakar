// Fonction de déconnexion côté client
function logout() {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    
    // Afficher un message ou rediriger l'utilisateur (facultatif)
    console.log('Utilisateur déconnecté');
    
    // Optionnellement, rediriger vers la page de connexion
    window.location.href = '/login';  // Rediriger vers la page de connexion
  }
  
  // Appeler la fonction logout lorsque l'utilisateur clique sur "Déconnexion"
  document.getElementById('logoutButton').addEventListener('click', logout);
  