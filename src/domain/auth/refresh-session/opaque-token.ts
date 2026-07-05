export interface OpaqueTokenService {
    generateToken(): string;
    hashToken(token: string): string;
}
