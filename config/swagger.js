
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'BookStore API',
    version: '1.0.0',
    description: 'API documentation for the BookStore application',
  },
  servers: [
    {
      url: 'http://localhost:4000', // Adjust based on your server
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Specify it's a JWT token
      },
    },
  },
  security: [
    {
      bearerAuth: [], // Applies Bearer token globally to all routes
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./routes/api/*.js'], // Adjust path to your route files
};

// Create Swagger spec
const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
