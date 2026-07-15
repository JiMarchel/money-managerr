import { InvalidWalletNameError } from "../error";

export class WalletName {
    private constructor(private readonly value: string) {}

    static create(name: string): WalletName {
        if (!name || name.trim().length === 0) {
            throw new InvalidWalletNameError("Wallet name cannot be empty");
        }
        
        return new WalletName(name.trim());
    }

    toString(): string {
        return this.value;
    }
}
