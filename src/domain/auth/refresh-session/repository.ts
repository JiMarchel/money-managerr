import { RefreshSession } from "./entity";

export interface RefreshSessionRepository {
    save(session: RefreshSession): Promise<void>;
    findByTokenHash(tokenHash: string): Promise<RefreshSession | null>;
    revoke(session: RefreshSession): Promise<void>;
}
