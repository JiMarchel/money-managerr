import { Elysia } from "elysia";
import { GetCurrentUserHandler } from "../handlers/user/get-current-user";
import { authGuard } from "../middleware/auth-guard";
import { TokenProvider } from "../../domain/auth/token-provider";

export const userRoutes = (
    getCurrentUserHandler: GetCurrentUserHandler,
    tokenProvider: TokenProvider
) =>
    new Elysia({ prefix: "/users" })
        .use(authGuard(tokenProvider))
        .get("/me", async ({ userId }) => {
            return getCurrentUserHandler.handle(userId);
        });
