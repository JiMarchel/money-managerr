import { ValidationError } from "../../shared/errors/validation-error";

export class WalletError extends Error {
    constructor(message: string, public readonly originalError?: unknown) {
        super(message);
        this.name = "WalletError";
    }
}

export class DuplicateWalletError extends WalletError {
    constructor(message: string = "Wallet with this name already exists") {
        super(message);
        this.name = "DuplicateWalletError";
    }
}

export class WalletNotFoundError extends WalletError {
    constructor(message: string = "Wallet not found") {
        super(message);
        this.name = "WalletNotFoundError";
    }
}

export class InvalidWalletNameError extends ValidationError {
    constructor(message: string) {
        super(message);
        this.name = "InvalidWalletNameError";
    }
}

export class InvalidCurrencyError extends ValidationError {
    constructor(message: string) {
        super(message);
        this.name = "InvalidCurrencyError";
    }
}

export class InvalidBalanceError extends ValidationError {
    constructor(message: string) {
        super(message);
        this.name = "InvalidBalanceError";
    }
}

export class InvalidAccountTypeError extends ValidationError {
    constructor(message: string) {
        super(message);
        this.name = "InvalidAccountTypeError";
    }
}
