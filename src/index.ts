import { Elysia } from "elysia";
import { openapi } from '@elysia/openapi'

const app = new Elysia().use(openapi()).get("/", () => "Hello Elysia").listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
