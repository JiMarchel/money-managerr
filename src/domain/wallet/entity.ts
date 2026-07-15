import { UserId } from "../user/value-objects/user-id";
import { AccountType } from "./value-objects/account-type";
import { Balance } from "./value-objects/balance";
import { Currency } from "./value-objects/currency";
import { WalletId } from "./value-objects/wallet-id";
import { WalletName } from "./value-objects/wallet-name";

export class Wallet {
    private constructor(
        public readonly id: WalletId,
        public readonly userId: UserId,
        public name: WalletName,
        public accountType: AccountType,
        public currency: Currency,
        public balance: Balance,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) {}

    static create(userId: UserId, name: WalletName, accountType: AccountType, currency: Currency): Wallet {
        const uuidv7 = Bun.randomUUIDv7();
        const walletId = WalletId.create(uuidv7);
        const now = new Date();
        const balance = Balance.create("0");

        return new Wallet(
            walletId,
            userId,
            name,
            accountType,
            currency,
            balance,
            now,
            now
        );
    }
}
