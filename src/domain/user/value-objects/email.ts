import { InvalidEmailError } from "../error";

export class Email {
    private constructor(
        public readonly value: string
    ) { }

    static create(email: string): Email {
        const value = email.trim().toLowerCase();

        if (value.length === 0) {
            throw new InvalidEmailError(
                "Email cannot be blank."
            );
        }

        if (!value.includes("@")) {
            throw new InvalidEmailError(
                "Email must contain @."
            );
        }

        if (value.length > 255) {
            throw new InvalidEmailError(
                "Email too long."
            );
        }

        return new Email(value);
    }

    equals(other: Email): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}