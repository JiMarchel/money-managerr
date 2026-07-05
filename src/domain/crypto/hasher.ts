import { PasswordHash } from "../user/value-objects/password-hash";

export interface PasswordHasher {
    hash(password: string): Promise<string>;
    verify(password: string, hash: PasswordHash): Promise<boolean>;
}