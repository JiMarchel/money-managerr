import { InvalidAccountTypeError } from "../error";

export const ValidAccountTypes = ["Cash", "Bank", "Credit Card", "Savings", "Investment", "E-Wallet", "Crypto", "Loan"] as const;
export type AccountTypeEnum = typeof ValidAccountTypes[number];

export class AccountType {
    private constructor(private readonly value: AccountTypeEnum) {}

    static create(type: string): AccountType {
        if (!ValidAccountTypes.includes(type as AccountTypeEnum)) {
            throw new InvalidAccountTypeError(`Invalid account type: ${type}`);
        }
        
        return new AccountType(type as AccountTypeEnum);
    }

    toString(): string {
        return this.value;
    }
}
