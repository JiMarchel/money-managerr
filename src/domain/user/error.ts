import { ValidationError } from "../../shared/errors";

export class InvalidEmailError extends ValidationError {
    constructor(reason: string) {
        super(`Invalid email: ${reason}`)
    }
}

export class InvalidUsernameError extends ValidationError {
    constructor(reason: string) {
        super(`Invalid username format: ${reason}`)
    }
}

export class InvalidPasswordHashError extends ValidationError {
    constructor() {
        super("Invalid hash format.")
    }
}

export class InvalidUserIdError extends ValidationError {
    constructor() {
        super("Invalid uuid format.")
    }
}