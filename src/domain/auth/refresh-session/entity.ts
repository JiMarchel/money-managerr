import { UserId } from "../../user/value-objects/user-id";
import { SessionId } from "./value-object/session-id";

export class RefreshSession {
    constructor(
        public readonly id: SessionId,
        public readonly userId: UserId,
        public readonly tokenHash: string,
        public readonly deviceName: string,
        public readonly expiresAt: Date,
        public readonly createdAt: Date,
        public revokedAt: Date | null,
        public lastUsedAt: Date | null
    ) { }

    static create(userId: UserId, tokenHash: string, deviceName: string, expiresAt: Date) {
        const uuidv7 = Bun.randomUUIDv7();
        const now = new Date()

        return new RefreshSession(
            SessionId.create(uuidv7),
            userId,
            tokenHash,
            deviceName,
            expiresAt,
            now,
            null,
            null
        )
    }

    revoke() {
        this.revokedAt = new Date();
    }

    touch() {
        this.lastUsedAt = new Date();
    }

    isExpired() {
        return this.expiresAt <= new Date();
    }

    isRevoked() {
        return this.revokedAt !== null;
    }
}