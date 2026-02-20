import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import swaggerUi from 'swagger-ui-express';

import { env } from './infrastructure/config/env';
import { swaggerSpec } from './infrastructure/config/swagger';
import { PrismaUserRepository } from './infrastructure/repositories/PrismaUserRepository';
import { BcryptPasswordHasher } from './infrastructure/services/BcryptPasswordHasher';
import { JwtTokenService } from './infrastructure/services/JwtTokenService';
import { RegisterUser } from './application/usecases/RegisterUser';
import { LoginUser } from './application/usecases/LoginUser';
import { GetCurrentUser } from './application/usecases/GetCurrentUser';
import { AuthController } from './presentation/controllers/AuthController';
import { createAuthRoutes } from './presentation/routes/auth.routes';
import { PrismaProjectRepository } from './infrastructure/repositories/PrismaProjectRepository';
import { CreateProject } from './application/usecases/CreateProject';
import { ListProjects } from './application/usecases/ListProjects';
import { GetProject } from './application/usecases/GetProject';
import { UpdateProject } from './application/usecases/UpdateProject';
import { DeleteProject } from './application/usecases/DeleteProject';
import { ProjectController } from './presentation/controllers/ProjectController';
import { createProjectRoutes } from './presentation/routes/project.routes';
import { errorHandler } from './presentation/middleware/errorHandler';

const prisma = new PrismaClient();

// Infrastructure
const userRepository = new PrismaUserRepository(prisma);
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService(env.jwtSecret);

// Use Cases
const registerUser = new RegisterUser(userRepository, passwordHasher, tokenService);
const loginUser = new LoginUser(userRepository, passwordHasher, tokenService);
const getCurrentUser = new GetCurrentUser(userRepository);

// Project Infrastructure & Use Cases
const projectRepository = new PrismaProjectRepository(prisma);
const createProject = new CreateProject(projectRepository);
const listProjects = new ListProjects(projectRepository);
const getProject = new GetProject(projectRepository);
const updateProject = new UpdateProject(projectRepository);
const deleteProject = new DeleteProject(projectRepository);

// Controllers
const authController = new AuthController(registerUser, loginUser, getCurrentUser);
const projectController = new ProjectController(
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
);

// Express App
const app = express();

app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', createAuthRoutes(authController, tokenService));
app.use('/api/projects', createProjectRoutes(projectController, tokenService));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
  console.log(`Swagger UI: http://localhost:${env.port}/api-docs`);
});
