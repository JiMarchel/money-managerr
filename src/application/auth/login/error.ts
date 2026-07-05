import { ValidationError } from "../../../shared/errors";

export class InvalidCredentialsError extends ValidationError {
    constructor() {
        super("Invalid email or password.");
    }
}
