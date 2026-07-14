import { Elysia } from "elysia";
import { ConflictError } from "../../shared/errors/conflict-error";
import { ValidationError } from "../../shared/errors/validation-error";
import { UnauthorizedError } from "../../shared/errors/unauthorized-error";
import { logger } from "../../shared/logger";
import { ApiErrorResponse } from "../types/response";

export const errorHandler = (app: Elysia) => app
    .onError((ctx) => {
        const { code, error, set } = ctx;
        const requestId = 'requestId' in ctx ? (ctx.requestId as string) : undefined;

        if (error instanceof UnauthorizedError) {
            logger.warn({ requestId }, error.message);

            set.status = 401;
            return {
                message: error.message,
            } satisfies ApiErrorResponse;
        }

        if (error instanceof ConflictError) {
            logger.warn({ requestId }, error.message);

            set.status = 409;
            return {
                message: error.message,
            } satisfies ApiErrorResponse;
        }

        if (error instanceof ValidationError) {
            logger.warn({ requestId }, error.message);

            set.status = 400;
            return {
                message: error.message,
            } satisfies ApiErrorResponse;
        }

        if (code === 'VALIDATION') {
            const fields = error.all.map((e) => ({
                field: (e as { path: string }).path?.replace("/", ""),
                message: (e as { summary: string }).summary
            }));

            logger.warn({ requestId, fields }, "DTO validation failed");

            set.status = 422;
            return {
                message: "Validation failed",
                fields,
            } satisfies ApiErrorResponse;
        }

        if (code === 'NOT_FOUND') {
            set.status = 404;
            return {
                message: "Route not found",
            } satisfies ApiErrorResponse;
        }

        // Fallback untuk unhandled server error
        logger.error({ requestId, err: error }, "Internal server error");

        set.status = 500;
        return {
            message: "Internal Server Error",
            requestId
        } satisfies ApiErrorResponse;
    });
