import { Elysia } from "elysia";
import { openapi } from '@elysia/openapi'
import { requestContext } from "./shared/request-context";
import { errorHandler } from "./presentation/middleware/error-handler";
import { requestLogger } from "./presentation/middleware/request-logger";
import { env } from "./config";

import { db } from "./infrastructure/database/db";
import { DrizzleUserRepository } from "./infrastructure/repositories/user";
import { DrizzleRefreshSessionRepository } from "./infrastructure/repositories/refresh-session";
import { DrizzleWalletRepository } from "./infrastructure/repositories/wallet";
import { DrizzleCategoryRepository } from "./infrastructure/repositories/category";
import { Argon2PasswordHasher } from "./infrastructure/crypto/hasher";
import { JwtTokenProvider } from "./infrastructure/crypto/jwt";
import { NodeCryptoOpaqueTokenService } from "./infrastructure/crypto/opaque-token";

import { RegisterUseCase } from "./application/auth/register/usecase";
import { LoginUseCase } from "./application/auth/login/usecase";
import { RefreshUseCase } from "./application/auth/refresh/usecase";
import { LogoutUseCase } from "./application/auth/logout/usecase";
import { GetCurrentUserUseCase } from "./application/user/get-current-user/usecase";
import { CreateWalletUseCase } from "./application/wallet/create-wallet/usecase";
import { GetWalletsUseCase } from "./application/wallet/get-wallets/usecase";
import { CreateCategoryUseCase } from "./application/category/create-category/usecase";
import { GetCategoriesUseCase } from "./application/category/get-categories/usecase";

import { RegisterHandler } from "./presentation/handlers/auth/register";
import { LoginHandler } from "./presentation/handlers/auth/login";
import { RefreshHandler } from "./presentation/handlers/auth/refresh";
import { authRoutes } from "./presentation/routes/auth";
import { LogoutHandler } from "./presentation/handlers/auth/logout";
import { GetCurrentUserHandler } from "./presentation/handlers/user/get-current-user";
import { userRoutes } from "./presentation/routes/user";
import { CreateWalletHandler } from "./presentation/handlers/wallet/create-wallet";
import { GetWalletsHandler } from "./presentation/handlers/wallet/get-wallets";
import { walletRoutes } from "./presentation/routes/wallet";
import { CreateCategoryHandler } from "./presentation/handlers/category/create-category";
import { GetCategoriesHandler } from "./presentation/handlers/category/get-categories";
import { categoryRoutes } from "./presentation/routes/category";

// Infrastructure
const userRepository = new DrizzleUserRepository(db);
const refreshSessionRepository = new DrizzleRefreshSessionRepository(db);
const passwordHasher = new Argon2PasswordHasher();
const tokenProvider = new JwtTokenProvider(env.JWT_SECRET);
const opaqueTokenService = new NodeCryptoOpaqueTokenService();
const walletRepository = new DrizzleWalletRepository(db);
const categoryRepository = new DrizzleCategoryRepository(db);

// Use Cases
const registerUseCase = new RegisterUseCase(userRepository, passwordHasher);
const loginUseCase = new LoginUseCase(userRepository, passwordHasher, tokenProvider, opaqueTokenService, refreshSessionRepository);
const refreshUseCase = new RefreshUseCase(tokenProvider, opaqueTokenService, refreshSessionRepository);
const logoutUseCase = new LogoutUseCase(refreshSessionRepository, opaqueTokenService);
const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);
const createWalletUseCase = new CreateWalletUseCase(walletRepository);
const getWalletsUseCase = new GetWalletsUseCase(walletRepository);
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository);

// Handlers
const registerHandler = new RegisterHandler(registerUseCase);
const loginHandler = new LoginHandler(loginUseCase);
const refreshHandler = new RefreshHandler(refreshUseCase);
const logoutHandler = new LogoutHandler(logoutUseCase);
const getCurrentUserHandler = new GetCurrentUserHandler(getCurrentUserUseCase);
const createWalletHandler = new CreateWalletHandler(createWalletUseCase);
const getWalletsHandler = new GetWalletsHandler(getWalletsUseCase);
const createCategoryHandler = new CreateCategoryHandler(createCategoryUseCase);
const getCategoriesHandler = new GetCategoriesHandler(getCategoriesUseCase);

// App
const app = new Elysia()
  .use(openapi())
  .use(requestContext)
  .use(requestLogger)
  .use(errorHandler)
  .use(authRoutes(registerHandler, loginHandler, refreshHandler, logoutHandler))
  .use(userRoutes(getCurrentUserHandler, tokenProvider))
  .use(walletRoutes(createWalletHandler, getWalletsHandler, tokenProvider))
  .use(categoryRoutes(createCategoryHandler, getCategoriesHandler, tokenProvider))
  .listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);