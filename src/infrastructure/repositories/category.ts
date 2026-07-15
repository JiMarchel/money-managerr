import { and, eq } from "drizzle-orm";
import { CategoryRepository } from "../../domain/category/repository";
import { Category } from "../../domain/category/entity";
import { CategoryId } from "../../domain/category/value-objects/category-id";
import { UserId } from "../../domain/user/value-objects/user-id";
import { CategoryName } from "../../domain/category/value-objects/category-name";
import { CategoryType, CategoryTypeEnum } from "../../domain/category/value-objects/category-type";
import { Database } from "../database/db";
import { categories } from "../database/schema";
import { DatabaseError } from "./error";

export class DrizzleCategoryRepository implements CategoryRepository {
    constructor(private readonly db: Database) { }

    async findById(id: CategoryId): Promise<Category | null> {
        try {
            const result = await this.db.select().from(categories).where(eq(categories.id, id.toString()));

            if (result.length === 0) {
                return null;
            }

            return this.mapToDomain(result[0]);
        } catch (error) {
            throw new DatabaseError("Failed to query category by id", error);
        }
    }

    async findByUserId(userId: UserId): Promise<Category[]> {
        try {
            const result = await this.db.select().from(categories).where(eq(categories.userId, userId.toString()));

            return result.map(row => this.mapToDomain(row));
        } catch (error) {
            throw new DatabaseError("Failed to query categories by user id", error);
        }
    }

    async findByUserIdAndName(userId: UserId, name: CategoryName): Promise<Category | null> {
        try {
            const result = await this.db.select().from(categories).where(
                and(
                    eq(categories.userId, userId.toString()),
                    eq(categories.name, name.toString())
                )
            );

            if (result.length === 0) {
                return null;
            }

            return this.mapToDomain(result[0]);
        } catch (error) {
            throw new DatabaseError("Failed to query category by user id and name", error);
        }
    }

    async save(category: Category): Promise<void> {
        try {
            await this.db.insert(categories).values(this.mapToPersistence(category));
        } catch (error) {
            throw new DatabaseError("Failed to save category", error);
        }
    }

    private mapToDomain(row: typeof categories.$inferSelect): Category {
        const category = Object.create(Category.prototype);

        Object.assign(category, {
            id: CategoryId.create(row.id),
            userId: UserId.create(row.userId),
            name: CategoryName.create(row.name),
            type: CategoryType.create(row.type)
        });

        return category;
    }

    private mapToPersistence(category: Category) {
        return {
            id: category.id.toString(),
            userId: category.userId.toString(),
            name: category.name.toString(),
            type: category.type.toString() as CategoryTypeEnum
        };
    }
}
