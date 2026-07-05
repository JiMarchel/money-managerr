import Elysia from "elysia";
import { TokenProvider } from "../../domain/auth/token-provider";
import { UnauthorizedError } from "../../shared/errors";
import { UserId } from "../../domain/user/value-objects/user-id";

export const authGuard = (tokenProvider: TokenProvider) =>
    new Elysia({ name: "auth-guard" })
        .derive(async ({ request }) => {
            const authHeader = request.headers.get("authorization");

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new UnauthorizedError("Missing or invalid authorization header");
            }

            const token = authHeader.split(" ")[1];
            if (!token) {
                throw new UnauthorizedError("Token is missing");
            }

            try {
                const claims = await tokenProvider.verifyAccessToken(token);

                return {
                    userId: UserId.create(claims.userId),
                };
            } catch {
                throw new UnauthorizedError("Invalid or expired access token");
            }
        })
        .as("scoped");