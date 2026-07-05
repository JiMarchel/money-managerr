import { OpaqueTokenService } from "../../../domain/auth/refresh-session/opaque-token";
import { RefreshSessionRepository } from "../../../domain/auth/refresh-session/repository";
import { InvalidRefreshTokenError } from "../refresh/error";
import { LogoutCommand } from "./command";

export class LogoutUseCase {
    constructor(private readonly refreshSessionRepository: RefreshSessionRepository, private readonly opaqueTokenService: OpaqueTokenService) { }

    public async execute(command: LogoutCommand) {
        const hashedInputToken = this.opaqueTokenService.hashToken(command.refreshToken);

        const session = await this.refreshSessionRepository.findByTokenHash(hashedInputToken);

        if (!session || session.isRevoked() || session.isExpired()) {
            throw new InvalidRefreshTokenError()
        }

        session?.revoke()
        await this.refreshSessionRepository.revoke(session)
    }
}