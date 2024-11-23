export interface User {
    _id: string;          // Identifiant généré automatiquement par MongoDB
    prenom: string;        // Prénom de l'utilisateur
    nom: string;           // Nom de l'utilisateur
    telephone: number;     // Numéro de téléphone, unique        
    email: string;         
    code:number;
    password:string;
    archive: boolean;      // Statut d'archivage (par défaut : false)
    role: 'admin' | 'user'; // Rôle de l'utilisateur (admin ou user)
  }

 