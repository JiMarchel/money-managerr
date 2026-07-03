import { defineConfig } from "drizzle-kit"
import { env } from "./src/config"

export default defineConfig({
    schema: './src/infrastructure/database/schema.ts',
    out: './drizzle',
    dialect: "postgresql",
    dbCredentials: {
        url: env.DATABASE_URL
    }
})