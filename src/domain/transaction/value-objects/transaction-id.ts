export class TransactionId {
    private constructor(private readonly value: string) {}

    static create(id: string): TransactionId {
        return new TransactionId(id);
    }

    toString(): string {
        return this.value;
    }
}
