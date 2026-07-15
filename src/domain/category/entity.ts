import { UserId } from "../user/value-objects/user-id";
import { CategoryId } from "./value-objects/category-id";
import { CategoryName } from "./value-objects/category-name";
import { CategoryType } from "./value-objects/category-type";

export class Category {
    private constructor(
        public readonly id: CategoryId,
        public readonly userId: UserId,
        public name: CategoryName,
        public type: CategoryType
    ) {}

    static create(userId: UserId, name: CategoryName, type: CategoryType): Category {
        const uuidv7 = Bun.randomUUIDv7();
        const categoryId = CategoryId.create(uuidv7);

        return new Category(
            categoryId,
            userId,
            name,
            type
        );
    }
}
