import { PasswordHasher } from "../../domain/crypto/hasher";
import { PasswordHash } from "../../domain/user/value-objects/password-hash";

//Bun.password by default is using argon2
export class Argon2PasswordHasher implements PasswordHasher {
    async hash(password: string): Promise<string> {
        return Bun.password.hash(password)
    }

    async verify(password: string, hash: PasswordHash): Promise<boolean> {
        return Bun.password.verify(password, hash.toString())
    }
}