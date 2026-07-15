import { Static, t } from "elysia";
import { ValidAccountTypes } from "../../../domain/wallet/value-objects/account-type";

export const CreateWalletDto = t.Object({
    name: t.String({ minLength: 1, error: "Wallet name cannot be empty" }),
    accountType: t.Union(ValidAccountTypes.map(type => t.Literal(type)), {
        error: `Account type must be one of: ${ValidAccountTypes.join(", ")}`
    }),
    currency: t.String({ minLength: 3, maxLength: 3, error: "Currency must be a 3-character code (e.g. IDR, USD)" })
});

export type CreateWalletDtoType = Static<typeof CreateWalletDto>;
