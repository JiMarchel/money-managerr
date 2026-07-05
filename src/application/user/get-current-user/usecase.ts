import { UserRepository } from "../../../domain/user/repository";
import { UnauthorizedError } from "../../../shared/errors";
import { GetCurrentUserCommand } from "./command";

export class GetCurrentUserUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(command: GetCurrentUserCommand) {
        const user = await this.userRepository.findById(command.userId);

        if (!user) {
            throw new UnauthorizedError("User not found");
        }

        return {
            id: user.id.toString(),
            email: user.email.toString(),
            username: user.username.toString(),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}
