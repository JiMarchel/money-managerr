import { jwtVerify, SignJWT } from "jose";
import { TokenClaims, TokenProvider } from "../../domain/auth/token-provider";
import { UserId } from "../../domain/user/value-objects/user-id";
import { InvalidTokenError } from "./error";

export class JwtTokenProvider implements TokenProvider {
    private readonly secret: Uint8Array;

    constructor(secret: string, private readonly expiresIn: string = "15m", private readonly alg: string = "HS256") {
        this.secret = new TextEncoder().encode(secret)
    }

    async generateAccessToken(userId: UserId): Promise<string> {
        const token = await new SignJWT({})
            .setProtectedHeader({ alg: this.alg })
            .setSubject(userId.toString())
            .setIssuedAt()
            .setExpirationTime(this.expiresIn)
            .sign(this.secret);

        return token
    }

    async verifyAccessToken(token: string): Promise<TokenClaims> {
        try {
            const { payload } = await jwtVerify(token, this.secret);

            return {
                userId: payload.sub!,
                issuedAt: payload.iat!,
                expiresAt: payload.exp!
            }

        } catch (error) {
            throw new InvalidTokenError(error)
        }
    }
}