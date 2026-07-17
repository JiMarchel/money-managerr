import { InvalidTransactionDateError } from "../error";

export class TransactionDate {
    private constructor(private readonly value: Date) {}

    static create(dateString: string | Date): TransactionDate {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new InvalidTransactionDateError("Invalid transaction date");
        }
        return new TransactionDate(date);
    }

    toDate(): Date {
        return this.value;
    }

    toISOString(): string {
        return this.value.toISOString();
    }
}
