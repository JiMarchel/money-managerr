import { Email } from "./value-objects/email"
import { PasswordHash } from "./value-objects/password-hash"
import { UserId } from "./value-objects/user-id"
import { Username } from "./value-objects/username"

export class User {
    private constructor(
        public readonly id: UserId,
        public email: Email,
        public username: Username,
        public passwordHash: PasswordHash,
        public readonly createdAt: Date,
        public updatedAt: Date) { }

    static create(email: Email, username: Username, passwordHash: PasswordHash): User {
        const uuidv7 = Bun.randomUUIDv7();
        const userId = UserId.create(uuidv7)
        const now = new Date()

        return new User(
            userId, email, username, passwordHash, now, now
        )
    }
}