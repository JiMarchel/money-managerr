import postgres from "postgres"
import { env } from "../../config";

import { drizzle } from 'drizzle-orm/postgres-js';

const queryClient = postgres(env.DATABASE_URL);

export const db = drizzle(queryClient);

export type Database = typeof db;