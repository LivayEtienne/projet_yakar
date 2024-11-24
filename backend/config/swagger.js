// swagger.js
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Version de l'API
    info: {
      title: 'API du projet yakaar',
      version: '1.0.0',
      description: 'Une API pour récupérer et gérer les données de température et d\'humidité.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api', // URL de votre API
      },
    ],
  },
  apis: ['./routes/*.js'], // Chemin vers les fichiers où se trouvent les annotations Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};