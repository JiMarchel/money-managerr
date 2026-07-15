import { UserId } from "../user/value-objects/user-id";
import { Category } from "./entity";
import { CategoryId } from "./value-objects/category-id";
import { CategoryName } from "./value-objects/category-name";

export interface CategoryRepository {
    findById(id: CategoryId): Promise<Category | null>;
    findByUserId(userId: UserId): Promise<Category[]>;
    findByUserIdAndName(userId: UserId, name: CategoryName): Promise<Category | null>;
    save(category: Category): Promise<void>;
}
