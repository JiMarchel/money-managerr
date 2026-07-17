import { Elysia, t } from "elysia";
import { CreateTransactionHandler } from "../handlers/transaction/create-transaction";
import { CreateTransferHandler } from "../handlers/transaction/create-transfer";
import { GetTransactionsHandler } from "../handlers/transaction/get-transactions";
import { authGuard } from "../middleware/auth-guard";
import { TokenProvider } from "../../domain/auth/token-provider";
import { CreateTransactionDto } from "../dto/transaction/create-transaction";
import { CreateTransferDto } from "../dto/transaction/create-transfer";

export const transactionRoutes = (
    createTransactionHandler: CreateTransactionHandler,
    createTransferHandler: CreateTransferHandler,
    getTransactionsHandler: GetTransactionsHandler,
    tokenProvider: TokenProvider
) => new Elysia({ prefix: "/transactions" })
    .use(authGuard(tokenProvider))
    .post("/", async ({ userId, body, set }) => {
        return createTransactionHandler.handle(userId, body, set);
    }, {
        body: CreateTransactionDto,
        detail: {
            tags: ["Transaction"],
            summary: "Create a new transaction (Income/Expense)"
        }
    })
    .post("/transfer", async ({ userId, body, set }) => {
        return createTransferHandler.handle(userId, body, set);
    }, {
        body: CreateTransferDto,
        detail: {
            tags: ["Transaction"],
            summary: "Create a new transfer between wallets"
        }
    })
    .get("/", async ({ userId, query }) => {
        return getTransactionsHandler.handle(userId, query);
    }, {
        query: t.Object({
            startDate: t.Optional(t.String({ format: "date", error: "startDate must be a valid date format (YYYY-MM-DD)" })),
            endDate: t.Optional(t.String({ format: "date", error: "endDate must be a valid date format (YYYY-MM-DD)" }))
        }),
        detail: {
            tags: ["Transaction"],
            summary: "Get all transactions with optional date filters"
        }
    });
