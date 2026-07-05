import { Elysia } from "elysia";
import { openapi } from '@elysia/openapi'
import { requestContext } from "./shared/request-context";
import { errorHandler } from "./presentation/middleware/error-handler";
import { requestLogger } from "./presentation/middleware/request-logger";
import { env } from "./config";

import { db } from "./infrastructure/database/db";
import { DrizzleUserRepository } from "./infrastructure/repositories/user";
import { DrizzleRefreshSessionRepository } from "./infrastructure/repositories/refresh-session";
import { Argon2PasswordHasher } from "./infrastructure/crypto/hasher";
import { JwtTokenProvider } from "./infrastructure/crypto/jwt";
import { NodeCryptoOpaqueTokenService } from "./infrastructure/crypto/opaque-token";

import { RegisterUseCase } from "./application/auth/register/usecase";
import { LoginUseCase } from "./application/auth/login/usecase";
import { RefreshUseCase } from "./application/auth/refresh/usecase";

import { RegisterHandler } from "./presentation/handlers/auth/register";
import { LoginHandler } from "./presentation/handlers/auth/login";
import { RefreshHandler } from "./presentation/handlers/auth/refresh";
import { authRoutes } from "./presentation/routes/auth";

// Infrastructure
const userRepository = new DrizzleUserRepository(db);
const refreshSessionRepository = new DrizzleRefreshSessionRepository(db);
const passwordHasher = new Argon2PasswordHasher();
const tokenProvider = new JwtTokenProvider(env.JWT_SECRET);
const opaqueTokenService = new NodeCryptoOpaqueTokenService();

// Use Cases
const registerUseCase = new RegisterUseCase(userRepository, passwordHasher);
const loginUseCase = new LoginUseCase(userRepository, passwordHasher, tokenProvider, opaqueTokenService, refreshSessionRepository);
const refreshUseCase = new RefreshUseCase(tokenProvider, opaqueTokenService, refreshSessionRepository);

// Handlers
const registerHandler = new RegisterHandler(registerUseCase);
const loginHandler = new LoginHandler(loginUseCase);
const refreshHandler = new RefreshHandler(refreshUseCase);

// App
const app = new Elysia()
  .use(openapi())
  .use(requestContext)
  .use(requestLogger)
  .use(errorHandler)
  .use(authRoutes(registerHandler, loginHandler, refreshHandler))
  .listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);