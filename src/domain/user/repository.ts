import { User } from "./entity";
import { Email } from "./value-objects/email";

export interface UserRepository {
    findByEmail(email: Email): Promise<User | null>;
    save(user: User): Promise<void>
}