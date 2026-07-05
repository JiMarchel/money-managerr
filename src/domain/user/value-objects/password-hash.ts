import { InvalidPasswordHashError } from "../error";

export class PasswordHash {
    private constructor(public readonly value: string) { }

    static create(passwordHash: string): PasswordHash {
        if (!passwordHash.startsWith("$argon2id$")) {
            throw new InvalidPasswordHashError();
        }

        return new PasswordHash(passwordHash)
    }

    toString(): string {
        return this.value;
    }
}