const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/yakar', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connecté: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Erreur de connexion à MongoDB: ${err.message}`);
    process.exit(1);  // Arrête le processus si la connexion échoue
  }
};

module.exports = connectDB;
