import { Category } from "../../../domain/category/entity";
import { DuplicateCategoryError } from "../../../domain/category/error";
import { CategoryRepository } from "../../../domain/category/repository";
import { CategoryName } from "../../../domain/category/value-objects/category-name";
import { CategoryType } from "../../../domain/category/value-objects/category-type";
import { CreateCategoryCommand } from "./command";

export class CreateCategoryUseCase {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    async execute(command: CreateCategoryCommand) {
        const categoryName = CategoryName.create(command.name);
        const categoryType = CategoryType.create(command.type);
        
        // Check for duplicates
        const existingCategory = await this.categoryRepository.findByUserIdAndName(command.userId, categoryName);
        if (existingCategory) {
            throw new DuplicateCategoryError(`Category with name '${command.name}' already exists for this user.`);
        }

        const category = Category.create(command.userId, categoryName, categoryType);

        await this.categoryRepository.save(category);

        return {
            id: category.id.toString(),
            name: category.name.toString(),
            type: category.type.toString()
        };
    }
}
