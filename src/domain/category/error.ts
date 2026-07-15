import { ValidationError } from "../../shared/errors/validation-error";

export class CategoryError extends Error {
    constructor(message: string, public readonly originalError?: unknown) {
        super(message);
        this.name = "CategoryError";
    }
}

export class DuplicateCategoryError extends CategoryError {
    constructor(message: string = "Category with this name already exists") {
        super(message);
        this.name = "DuplicateCategoryError";
    }
}

export class CategoryNotFoundError extends CategoryError {
    constructor(message: string = "Category not found") {
        super(message);
        this.name = "CategoryNotFoundError";
    }
}

export class InvalidCategoryNameError extends ValidationError {
    constructor(message: string) {
        super(message);
        this.name = "InvalidCategoryNameError";
    }
}

export class InvalidCategoryTypeError extends ValidationError {
    constructor(message: string) {
        super(message);
        this.name = "InvalidCategoryTypeError";
    }
}
