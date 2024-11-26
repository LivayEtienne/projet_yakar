// src/app/post/donne.ts

export interface Donnee {
    _id?: string;  // L'ID est généré par MongoDB, donc il est optionnel
    temperature: number;
    humidite: number;
    date: "2024-11-21T10:00:00Z",
  }
  