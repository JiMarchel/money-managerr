import { AppError } from "./app-error";

export abstract class InfrastructureError extends AppError {
    constructor(message: string, cause?: unknown) {
        super(message, {
            expose: false,
            logLevel: "error",
            cause
        });
    }
}