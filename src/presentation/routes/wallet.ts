import { Elysia } from "elysia";
import { CreateWalletHandler } from "../handlers/wallet/create-wallet";
import { GetWalletsHandler } from "../handlers/wallet/get-wallets";
import { authGuard } from "../middleware/auth-guard";
import { TokenProvider } from "../../domain/auth/token-provider";
import { CreateWalletDto } from "../dto/wallet/create-wallet";

export const walletRoutes = (
    createWalletHandler: CreateWalletHandler,
    getWalletsHandler: GetWalletsHandler,
    tokenProvider: TokenProvider
) => new Elysia({ prefix: "/wallets" })
    .use(authGuard(tokenProvider))
    .post("/", async ({ userId, body, set }) => {
        return createWalletHandler.handle(userId, body, set);
    }, {
        body: CreateWalletDto,
        detail: {
            tags: ["Wallet"],
            summary: "Create a new wallet",
            description: "Create a new wallet for the authenticated user"
        }
    })
    .get("/", async ({ userId }) => {
        return getWalletsHandler.handle(userId);
    }, {
        detail: {
            tags: ["Wallet"],
            summary: "Get all wallets",
            description: "Get all wallets for the authenticated user"
        }
    });
