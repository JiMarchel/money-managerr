export abstract class AppError extends Error {
    readonly expose: boolean;
    readonly logLevel: "warn" | "error";
    readonly cause?: unknown;

    constructor(
        message: string,
        options?: {
            expose?: boolean;
            logLevel?: "warn" | "error";
            cause?: unknown
        }
    ) {
        super(message);

        this.name = this.constructor.name;

        this.expose = options?.expose ?? true;
        this.logLevel = options?.logLevel ?? "error";
        this.cause = options?.cause;

        Error.captureStackTrace?.(this, this.constructor)
    }
}