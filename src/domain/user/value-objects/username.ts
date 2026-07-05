import { InvalidUsernameError } from "../error"

export class Username {
    private constructor(public readonly value: string) { }

    static create(username: string): Username {
        if (username.length < 3) {
            throw new InvalidUsernameError("Too short.");
        }

        if (username.length > 255) {
            throw new InvalidUsernameError("Too long.")
        }

        return new Username(username)
    }

    toString(): string {
        return this.value;
    }
}