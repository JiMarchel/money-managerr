import { eq } from "drizzle-orm";
import { UserRepository } from "../../domain/user/repository";
import { Email } from "../../domain/user/value-objects/email";
import { UserId } from "../../domain/user/value-objects/user-id";
import { Username } from "../../domain/user/value-objects/username";
import { PasswordHash } from "../../domain/user/value-objects/password-hash";
import { Database } from "../database/db";
import { users } from "../database/schema";
import { User } from "../../domain/user/entity";

export class DrizzleUserRepository implements UserRepository {
    constructor(private readonly db: Database) { }

    async findByEmail(email: Email): Promise<User | null> {
        const result = await this.db.select().from(users).where(eq(users.email, email.toString()))

        if (result.length === 0) {
            return null;
        }

        return this.mapToDomain(result[0])
    }

    async save(user: User): Promise<void> {
        await this.db.insert(users).values(this.mapToPersistence(user))
    }

    private mapToDomain(row: typeof users.$inferSelect): User {
        const user = Object.create(User.prototype);
        
        Object.assign(user, {
            id: UserId.create(row.id),
            email: Email.create(row.email),
            username: Username.create(row.username),
            passwordHash: PasswordHash.create(row.passwordHash),
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        });

        return user;
    }

    private mapToPersistence(user: User) {
        return {
            id: user.id.toString(),
            email: user.email.toString(),
            username: user.username.toString(),
            passwordHash: user.passwordHash.toString(),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }
}