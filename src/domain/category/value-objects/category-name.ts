import { InvalidCategoryNameError } from "../error";

export class CategoryName {
    private constructor(private readonly value: string) {}

    static create(name: string): CategoryName {
        if (!name || name.trim().length === 0) {
            throw new InvalidCategoryNameError("Category name cannot be empty");
        }
        
        return new CategoryName(name.trim());
    }

    toString(): string {
        return this.value;
    }
}
