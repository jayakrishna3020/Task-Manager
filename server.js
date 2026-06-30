const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const connectDatabase = require('./src/config/database');
const logger = require('./src/middleware/logger');
const errorHandler = require('./src/middleware/errorHandler');

const userRoutes = require('./src/routes/userRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

const app = express();

// Connect to MongoDB Database
connectDatabase();

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom HTTP request logger middleware
app.use(logger);

// Swagger Documentation Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'A secure backend API for managing tasks, complete with MongoDB database integration, user authentication, and task filtering/pagination.',
      contact: {
        name: 'API Support',
        email: 'admin@taskmanager.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    uptime: process.uptime(),
  });
});

// Register routes
app.use('/api/auth', userRoutes);
app.use('/api/tasks', taskRoutes);

// Catch 404 Route Errors
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Requested API endpoint not found',
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Task Manager API Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`====================================================`);
});
