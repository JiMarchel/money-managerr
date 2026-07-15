import { Elysia } from "elysia";
import { CreateCategoryHandler } from "../handlers/category/create-category";
import { GetCategoriesHandler } from "../handlers/category/get-categories";
import { authGuard } from "../middleware/auth-guard";
import { TokenProvider } from "../../domain/auth/token-provider";
import { CreateCategoryDto } from "../dto/category/create-category";

export const categoryRoutes = (
    createCategoryHandler: CreateCategoryHandler,
    getCategoriesHandler: GetCategoriesHandler,
    tokenProvider: TokenProvider
) => new Elysia({ prefix: "/categories" })
    .use(authGuard(tokenProvider))
    .post("/", async ({ userId, body, set }) => {
        return createCategoryHandler.handle(userId, body, set);
    }, {
        body: CreateCategoryDto,
        detail: {
            tags: ["Category"],
            summary: "Create a new category",
            description: "Create a new category for the authenticated user"
        }
    })
    .get("/", async ({ userId }) => {
        return getCategoriesHandler.handle(userId);
    }, {
        detail: {
            tags: ["Category"],
            summary: "Get all categories",
            description: "Get all categories for the authenticated user"
        }
    });
