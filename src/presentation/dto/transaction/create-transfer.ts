import { Static, t } from "elysia";

export const CreateTransferDto = t.Object({
    sourceAccountId: t.String({ format: "uuid", error: "Invalid source account ID" }),
    destinationAccountId: t.String({ format: "uuid", error: "Invalid destination account ID" }),
    amount: t.Numeric({ minimum: 0.01, error: "Amount must be greater than zero" }),
    description: t.String({ minLength: 1, error: "Description cannot be empty" }),
    date: t.String({ format: "date-time", error: "Invalid date format" })
});

export type CreateTransferDtoType = Static<typeof CreateTransferDto>;
