import { InvalidAmountError } from "../error";

export class Amount {
    private constructor(private readonly value: string) {}

    static create(amount: string | number): Amount {
        const numValue = Number(amount);
        if (isNaN(numValue) || numValue <= 0) {
            throw new InvalidAmountError("Transaction amount must be greater than zero");
        }
        return new Amount(numValue.toString());
    }

    toNumber(): number {
        return Number(this.value);
    }

    toString(): string {
        return this.value;
    }
}
