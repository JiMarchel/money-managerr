import { InvalidBalanceError } from "../error";

export class Balance {
    private constructor(private readonly value: string) {}

    static create(balance: string | number): Balance {
        const numVal = typeof balance === "string" ? parseFloat(balance) : balance;
        if (isNaN(numVal)) {
            throw new InvalidBalanceError("Balance must be a valid number");
        }
        
        return new Balance(numVal.toString());
    }

    toString(): string {
        return this.value;
    }
}
