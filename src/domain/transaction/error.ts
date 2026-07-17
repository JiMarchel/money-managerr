import { ValidationError } from "../../shared/errors/validation-error";

export class TransactionError extends Error {
    constructor(message: string, public readonly originalError?: unknown) {
        super(message);
        this.name = "TransactionError";
    }
}

export class TransactionNotFoundError extends TransactionError {
    constructor(message: string = "Transaction not found") {
        super(message);
        this.name = "TransactionNotFoundError";
    }
}

export class InvalidAmountError extends ValidationError {
    constructor(message: string) {
        super(message);
        this.name = "InvalidAmountError";
    }
}

export class InvalidDirectionError extends ValidationError {
    constructor(message: string) {
        super(message);
        this.name = "InvalidDirectionError";
    }
}

export class InvalidDescriptionError extends ValidationError {
    constructor(message: string) {
        super(message);
        this.name = "InvalidDescriptionError";
    }
}

export class InvalidTransactionDateError extends ValidationError {
    constructor(message: string) {
        super(message);
        this.name = "InvalidTransactionDateError";
    }
}
