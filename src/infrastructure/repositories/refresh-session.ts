import { eq } from "drizzle-orm";
import { RefreshSession } from "../../domain/auth/refresh-session/entity";
import { RefreshSessionRepository } from "../../domain/auth/refresh-session/repository";
import { SessionId } from "../../domain/auth/refresh-session/value-object/session-id";
import { UserId } from "../../domain/user/value-objects/user-id";
import { Database } from "../database/db";
import { refreshToken } from "../database/schema";
import { DatabaseError } from "./error";

export class DrizzleRefreshSessionRepository implements RefreshSessionRepository {
    constructor(private readonly db: Database) { }

    async save(session: RefreshSession): Promise<void> {
        try {
            await this.db.insert(refreshToken).values(this.mapToPersistence(session));
        } catch (error) {
            throw new DatabaseError("Failed to save refresh session", error);
        }
    }

    async findByTokenHash(tokenHash: string): Promise<RefreshSession | null> {
        try {
            const result = await this.db.select().from(refreshToken).where(eq(refreshToken.tokenHash, tokenHash));

            if (result.length === 0) {
                return null;
            }

            return this.mapToDomain(result[0]);
        } catch (error) {
            throw new DatabaseError("Failed to query refresh session", error);
        }
    }

    async revoke(session: RefreshSession): Promise<void> {
        try {
            await this.db.update(refreshToken)
                .set({
                    revokedAt: session.revokedAt,
                    lastUsedAt: session.lastUsedAt,
                })
                .where(eq(refreshToken.id, session.id.toString()));
        } catch (error) {
            throw new DatabaseError("Failed to update refresh session", error);
        }
    }

    private mapToDomain(row: typeof refreshToken.$inferSelect): RefreshSession {
        // Because RefreshSession is a DDD entity with methods (isExpired, etc) 
        // we should re-construct it properly. Since its properties are readonly and set in constructor, 
        // we can use Object.create and Object.assign just like in UserRepository, or call the constructor directly.
        // It's cleaner to instantiate using Object.create to avoid constructor side effects or if constructor is private.
        const session = Object.create(RefreshSession.prototype);

        Object.assign(session, {
            id: SessionId.create(row.id),
            userId: UserId.create(row.userId),
            tokenHash: row.tokenHash,
            deviceName: row.deviceName,
            expiresAt: row.expiresAt,
            createdAt: row.createdAt,
            revokedAt: row.revokedAt,
            lastUsedAt: row.lastUsedAt
        });

        return session;
    }

    private mapToPersistence(session: RefreshSession) {
        return {
            id: session.id.toString(),
            userId: session.userId.toString(),
            tokenHash: session.tokenHash,
            deviceName: session.deviceName,
            expiresAt: session.expiresAt,
            createdAt: session.createdAt,
            revokedAt: session.revokedAt,
            lastUsedAt: session.lastUsedAt
        };
    }
}
