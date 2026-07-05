import { Elysia } from "elysia";
import { logger } from "../../shared/logger";
import { requestContext } from "../../shared/request-context";

export const requestLogger = new Elysia()
    .use(requestContext)
    .onBeforeHandle(({ request, requestId }) => {
        logger.info({
            requestId,
            method: request.method,
            path: new URL(request.url).pathname,
        });
    });