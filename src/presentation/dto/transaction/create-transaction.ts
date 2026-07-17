import { Static, t } from "elysia";
import { ValidDirections } from "../../../domain/transaction/value-objects/direction";

export const CreateTransactionDto = t.Object({
    accountId: t.String({ format: "uuid", error: "Invalid account ID" }),
    categoryId: t.String({ format: "uuid", error: "Invalid category ID" }),
    amount: t.Numeric({ minimum: 0.01, error: "Amount must be greater than zero" }),
    direction: t.Union(ValidDirections.map(dir => t.Literal(dir)), {
        error: `Direction must be one of: ${ValidDirections.join(", ")}`
    }),
    description: t.String({ minLength: 1, error: "Description cannot be empty" }),
    date: t.String({ format: "date-time", error: "Invalid date format" })
});

export type CreateTransactionDtoType = Static<typeof CreateTransactionDto>;
