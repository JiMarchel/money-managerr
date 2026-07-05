import { User } from "./entity";
import { Email } from "./value-objects/email";
import { UserId } from "./value-objects/user-id";

export interface UserRepository {
    findById(id: UserId): Promise<User | null>;
    findByEmail(email: Email): Promise<User | null>;
    save(user: User): Promise<void>
}