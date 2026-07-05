import { AppError } from "./app-error";

export abstract class ConflictError extends AppError {
    constructor(message: string) {
        super(message, {
            expose: true,
            logLevel: "warn"
        });
    }
}