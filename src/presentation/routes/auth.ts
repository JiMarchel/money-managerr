import { Elysia, t } from "elysia";
import { RegisterHandler } from "../handlers/auth/register";
import { LoginHandler } from "../handlers/auth/login";
import { RefreshHandler } from "../handlers/auth/refresh";
import { LogoutHandler } from "../handlers/auth/logout";

export const authRoutes = (
    registerHandler: RegisterHandler,
    loginHandler: LoginHandler,
    refreshHandler: RefreshHandler,
    logoutHandler: LogoutHandler
) =>
    new Elysia({ prefix: "/auth" })
        .post("/register", async ({ body }) => {
            return registerHandler.handle(body);
        }, {
            body: t.Object({
                email: t.String({ format: "email" }),
                username: t.String({ minLength: 3 }),
                password: t.String({ minLength: 8 })
            })
        })
        .post("/login", async ({ body }) => {
            return loginHandler.handle(body);
        }, {
            body: t.Object({
                email: t.String({ format: "email" }),
                password: t.String({ minLength: 1 }),
                deviceName: t.String({ minLength: 1 })
            })
        })
        .post("/refresh", async ({ body }) => {
            return refreshHandler.handle(body);
        }, {
            body: t.Object({
                refreshToken: t.String({ minLength: 1 }),
                deviceName: t.String({ minLength: 1 })
            })
        })
        .post("/logout", async ({ body }) => {
            return logoutHandler.handle(body);
        }, {
            body: t.Object({
                refreshToken: t.String({ minLength: 1 })
            })
        })