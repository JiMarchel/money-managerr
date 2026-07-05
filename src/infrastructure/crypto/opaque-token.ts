import * as crypto from "crypto";
import { OpaqueTokenService } from "../../domain/auth/refresh-session/opaque-token";
import { CryptoGenerationError } from "./error";

export class NodeCryptoOpaqueTokenService implements OpaqueTokenService {
    generateToken(): string {
        try {
            // Generate 32 random bytes and convert to base64url for a url-safe token
            return crypto.randomBytes(32).toString('');
        } catch (error) {
            throw new CryptoGenerationError("Failed to generate opaque token", error);
        }
    }

    hashToken(token: string): string {
        try {
            // Hash the token using SHA-256 for secure database storage
            return crypto.createHash('sha256').update(token).digest('hex');
        } catch (error) {
            throw new CryptoGenerationError("Failed to hash opaque token", error);
        }
    }
}
