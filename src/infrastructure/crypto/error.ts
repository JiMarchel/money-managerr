import { InfrastructureError } from "../../shared/errors";

export class InvalidTokenError extends InfrastructureError {
    constructor(
        cause?: unknown
    ) {
        super("Invalid token", cause);
    }
}

export class CryptoGenerationError extends InfrastructureError {
    constructor(
        message = "Crypto generation failed",
        cause?: unknown
    ) {
        super(message, cause);
    }
}