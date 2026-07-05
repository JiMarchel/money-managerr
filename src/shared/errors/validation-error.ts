import { AppError } from "./app-error";

export abstract class ValidationError extends AppError {
    constructor(message: string) {
        super(message, {
            expose: true,
            logLevel: "warn"
        })
    }
}