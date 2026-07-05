import { Elysia } from "elysia";
import { openapi } from '@elysia/openapi'
import { requestContext } from "./shared/request-context";
import { errorHandler } from "./presentation/middleware/error-handler";
import { requestLogger } from "./presentation/middleware/request-logger";

import { db } from "./infrastructure/database/db";
import { DrizzleUserRepository } from "./infrastructure/repositories/user";
import { Argon2PasswordHasher } from "./infrastructure/crypto/hasher";

import { RegisterUseCase } from "./application/auth/register/usecase";

import { RegisterHandler } from "./presentation/handlers/auth/register";
import { authRoutes } from "./presentation/routes/auth";

// Infrastructure
const userRepository = new DrizzleUserRepository(db);
const passwordHasher = new Argon2PasswordHasher();

// Use Cases
const registerUseCase = new RegisterUseCase(userRepository, passwordHasher);

// Handlers
const registerHandler = new RegisterHandler(registerUseCase);

// App
const app = new Elysia()
  .use(openapi())
  .use(requestContext)
  .use(requestLogger)
  .use(errorHandler)
  .use(authRoutes(registerHandler))
  .listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);