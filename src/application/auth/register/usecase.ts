import { PasswordHasher } from "../../../domain/crypto/hasher";
import { User } from "../../../domain/user/entity";
import { UserRepository } from "../../../domain/user/repository";
import { Email } from "../../../domain/user/value-objects/email";
import { PasswordHash } from "../../../domain/user/value-objects/password-hash";
import { Username } from "../../../domain/user/value-objects/username";
import { RegisterCommand } from "./command";
import { EmailAlreadyExistsError } from "./error";

export class RegisterUseCase {
    constructor(private readonly userRepo: UserRepository, private readonly passwordHasher: PasswordHasher) { }

    public async execute(command: RegisterCommand) {
        const email = Email.create(command.email)
        const username = Username.create(command.username)

        const userExists = await this.userRepo.findByEmail(email)

        if (userExists) {
            throw new EmailAlreadyExistsError()
        }

        const hash = await this.passwordHasher.hash(command.password);
        const passwordHash = PasswordHash.create(hash);
        const user = User.create(email, username, passwordHash);

        await this.userRepo.save(user)
    }
}