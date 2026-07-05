import { ValidationError } from "../../../shared/errors";

export class InvalidRefreshTokenError extends ValidationError {
    constructor() {
        super("Invalid or expired refresh token.");
    }
}
