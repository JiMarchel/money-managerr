import { InvalidCategoryTypeError } from "../error";

export const ValidCategoryTypes = ["Income", "Expense", "Transfer"] as const;
export type CategoryTypeEnum = typeof ValidCategoryTypes[number];

export class CategoryType {
    private constructor(private readonly value: CategoryTypeEnum) {}

    static create(type: string): CategoryType {
        if (!ValidCategoryTypes.includes(type as CategoryTypeEnum)) {
            throw new InvalidCategoryTypeError(`Invalid category type: ${type}`);
        }
        
        return new CategoryType(type as CategoryTypeEnum);
    }

    toString(): string {
        return this.value;
    }
}
