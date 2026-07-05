import { InfrastructureError } from "../../shared/errors";

export class DatabaseError extends InfrastructureError {
    constructor(
        message = "Database operation failed",
        cause?: unknown
    ) {
        super(message, cause);
    }
}