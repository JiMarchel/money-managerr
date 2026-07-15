export class WalletId {
    private constructor(private readonly value: string) {}

    static create(id: string): WalletId {
        return new WalletId(id);
    }

    toString(): string {
        return this.value;
    }
}
