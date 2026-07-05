import { ConflictError } from "../../../shared/errors";

export class EmailAlreadyExistsError extends ConflictError {
    constructor() {
        super(`Email already registered.`)
    }
}