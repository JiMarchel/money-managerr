import { InvalidUserIdError } from "../error";
import { validate, version } from "uuid";

export class UserId {
    private constructor(public readonly value: string) { }

    static create(userId: string): UserId {
        const isValid = validate(userId);
        const isV7 = isValid && version(userId) === 7;

        if (!isValid || !isV7) {
            throw new InvalidUserIdError();
        }

        return new UserId(userId)
    }

    toString(): string {
        return this.value;
    }
}