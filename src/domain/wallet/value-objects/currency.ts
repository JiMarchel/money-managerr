import { InvalidCurrencyError } from "../error";

export class Currency {
    private constructor(private readonly value: string) {}

    static create(currency: string): Currency {
        if (!currency || currency.trim().length !== 3) {
            throw new InvalidCurrencyError("Currency must be a 3-character code");
        }
        
        return new Currency(currency.trim().toUpperCase());
    }

    toString(): string {
        return this.value;
    }
}
