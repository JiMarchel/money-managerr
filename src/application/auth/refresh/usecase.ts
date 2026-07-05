import { TokenProvider } from "../../../domain/auth/token-provider";
import { OpaqueTokenService } from "../../../domain/auth/refresh-session/opaque-token";
import { RefreshSessionRepository } from "../../../domain/auth/refresh-session/repository";
import { RefreshCommand } from "./command";
import { InvalidRefreshTokenError } from "./error";
import { RefreshSession } from "../../../domain/auth/refresh-session/entity";

export class RefreshUseCase {
    constructor(
        private readonly tokenProvider: TokenProvider,
        private readonly opaqueTokenService: OpaqueTokenService,
        private readonly refreshSessionRepository: RefreshSessionRepository
    ) { }

    async execute(command: RefreshCommand) {
        const hashedInputToken = this.opaqueTokenService.hashToken(command.refreshToken);

        const session = await this.refreshSessionRepository.findByTokenHash(hashedInputToken);

        if (!session || session.isExpired() || session.isRevoked()) {
            throw new InvalidRefreshTokenError();
        }

        session.revoke();
        await this.refreshSessionRepository.revoke(session);

        const newAccessToken = await this.tokenProvider.generateAccessToken(session.userId);

        const newRawRefreshToken = this.opaqueTokenService.generateToken();
        const newHashedRefreshToken = this.opaqueTokenService.hashToken(newRawRefreshToken);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const newSession = RefreshSession.create(
            session.userId,
            newHashedRefreshToken,
            command.deviceName,
            expiresAt
        );

        await this.refreshSessionRepository.save(newSession);

        return {
            accessToken: newAccessToken,
            refreshToken: newRawRefreshToken
        };
    }
}
