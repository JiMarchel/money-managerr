import { InvalidDescriptionError } from "../error";

export class Description {
    private constructor(private readonly value: string) {}

    static create(description: string): Description {
        if (!description || description.trim().length === 0) {
            throw new InvalidDescriptionError("Transaction description cannot be empty");
        }
        return new Description(description.trim());
    }

    toString(): string {
        return this.value;
    }
}
