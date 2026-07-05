import { UserId } from "../user/value-objects/user-id";

export interface TokenClaims {
    userId: string;
    issuedAt: number;
    expiresAt: number;
}

export interface TokenProvider {
    generateAccessToken(userId: UserId): Promise<string>;
    verifyAccessToken(token: string): Promise<TokenClaims>;
}
