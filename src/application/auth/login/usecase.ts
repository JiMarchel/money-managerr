import { TokenProvider } from "../../../domain/auth/token-provider";
import { OpaqueTokenService } from "../../../domain/auth/refresh-session/opaque-token";
import { PasswordHasher } from "../../../domain/crypto/hasher";
import { UserRepository } from "../../../domain/user/repository";
import { RefreshSessionRepository } from "../../../domain/auth/refresh-session/repository";
import { Email } from "../../../domain/user/value-objects/email";
import { LoginCommand } from "./command";
import { InvalidCredentialsError } from "./error";
import { RefreshSession } from "../../../domain/auth/refresh-session/entity";

export class LoginUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly tokenProvider: TokenProvider,
        private readonly opaqueTokenService: OpaqueTokenService,
        private readonly refreshSessionRepository: RefreshSessionRepository
    ) { }

    async execute(command: LoginCommand) {
        const user = await this.userRepository.findByEmail(Email.create(command.email));
        if (!user) {
            throw new InvalidCredentialsError();
        }

        const isPasswordValid = await this.passwordHasher.verify(command.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new InvalidCredentialsError();
        }

        const accessToken = await this.tokenProvider.generateAccessToken(user.id);

        const rawRefreshToken = this.opaqueTokenService.generateToken();
        const hashedRefreshToken = this.opaqueTokenService.hashToken(rawRefreshToken);

        // Set expiry to 7 days from now
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const refreshSession = RefreshSession.create(
            user.id,
            hashedRefreshToken,
            command.deviceName,
            expiresAt
        );

        await this.refreshSessionRepository.save(refreshSession);

        return {
            accessToken,
            refreshToken: rawRefreshToken
        };
    }
}
