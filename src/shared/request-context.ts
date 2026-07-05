import { Elysia } from "elysia";

export const requestContext = (app: Elysia) => app
    .derive(() => ({
        requestId: Bun.randomUUIDv7(),
    }))
    .onAfterHandle(({ requestId, set }) => {
        set.headers["x-request-id"] = requestId;
    });