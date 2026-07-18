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
import { DrizzleTransactionRepository } from "./infrastructure/repositories/transaction";
import { DrizzleStatisticsRepository } from "./infrastructure/repositories/statistics";
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
import { CreateTransactionUseCase } from "./application/transaction/create-transaction/usecase";
import { CreateTransferUseCase } from "./application/transaction/create-transfer/usecase";
import { GetTransactionsUseCase } from "./application/transaction/get-transactions/usecase";
import { GetTransactionUseCase } from "./application/transaction/get-transaction/usecase";
import { UpdateTransactionUseCase } from "./application/transaction/update-transaction/usecase";
import { UpdateTransferUseCase } from "./application/transaction/update-transfer/usecase";
import { DeleteTransactionUseCase } from "./application/transaction/delete-transaction/usecase";
import { GetStatisticsUseCase } from "./application/statistics/get-statistics/usecase";

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
import { CreateTransactionHandler } from "./presentation/handlers/transaction/create-transaction";
import { CreateTransferHandler } from "./presentation/handlers/transaction/create-transfer";
import { GetTransactionsHandler } from "./presentation/handlers/transaction/get-transactions";
import { GetTransactionHandler } from "./presentation/handlers/transaction/get-transaction";
import { UpdateTransactionHandler } from "./presentation/handlers/transaction/update-transaction";
import { UpdateTransferHandler } from "./presentation/handlers/transaction/update-transfer";
import { DeleteTransactionHandler } from "./presentation/handlers/transaction/delete-transaction";
import { transactionRoutes } from "./presentation/routes/transaction";
import { GetStatisticsHandler } from "./presentation/handlers/statistics/get-statistics";
import { statisticsRoutes } from "./presentation/routes/statistics";

// Infrastructure
const userRepository = new DrizzleUserRepository(db);
const refreshSessionRepository = new DrizzleRefreshSessionRepository(db);
const passwordHasher = new Argon2PasswordHasher();
const tokenProvider = new JwtTokenProvider(env.JWT_SECRET);
const opaqueTokenService = new NodeCryptoOpaqueTokenService();
const walletRepository = new DrizzleWalletRepository(db);
const categoryRepository = new DrizzleCategoryRepository(db);
const transactionRepository = new DrizzleTransactionRepository(db);
const statisticsRepository = new DrizzleStatisticsRepository(db);

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
const createTransactionUseCase = new CreateTransactionUseCase(transactionRepository);
const createTransferUseCase = new CreateTransferUseCase(transactionRepository);
const getTransactionsUseCase = new GetTransactionsUseCase(transactionRepository);
const getTransactionUseCase = new GetTransactionUseCase(transactionRepository);
const updateTransactionUseCase = new UpdateTransactionUseCase(transactionRepository);
const updateTransferUseCase = new UpdateTransferUseCase(transactionRepository);
const deleteTransactionUseCase = new DeleteTransactionUseCase(transactionRepository);
const getStatisticsUseCase = new GetStatisticsUseCase(statisticsRepository);

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
const createTransactionHandler = new CreateTransactionHandler(createTransactionUseCase);
const createTransferHandler = new CreateTransferHandler(createTransferUseCase);
const getTransactionsHandler = new GetTransactionsHandler(getTransactionsUseCase);
const getTransactionHandler = new GetTransactionHandler(getTransactionUseCase);
const updateTransactionHandler = new UpdateTransactionHandler(updateTransactionUseCase);
const updateTransferHandler = new UpdateTransferHandler(updateTransferUseCase);
const deleteTransactionHandler = new DeleteTransactionHandler(deleteTransactionUseCase);
const getStatisticsHandler = new GetStatisticsHandler(getStatisticsUseCase);

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
  .use(transactionRoutes(
      createTransactionHandler, 
      createTransferHandler, 
      getTransactionsHandler, 
      getTransactionHandler,
      updateTransactionHandler,
      updateTransferHandler,
      deleteTransactionHandler,
      tokenProvider
  ))
  .use(statisticsRoutes(getStatisticsHandler, tokenProvider))
  .listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);