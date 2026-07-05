import { Elysia, t } from "elysia";
import { RegisterHandler } from "../handlers/auth/register";

export const authRoutes = (registerHandler: RegisterHandler) =>
    new Elysia({ prefix: "/auth" })
        .post("/register", async ({ body, set }) => {
            set.status = 201;
            return registerHandler.handle(body);
        }, {
            body: t.Object({
                email: t.String({ format: "email" }),
                username: t.String({ minLength: 3 }),
                password: t.String({ minLength: 8 })
            })
        });
