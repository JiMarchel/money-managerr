import { CategoryRepository } from "../../../domain/category/repository";
import { GetCategoriesQuery } from "./query";

export class GetCategoriesUseCase {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    async execute(query: GetCategoriesQuery) {
        const categories = await this.categoryRepository.findByUserId(query.userId);

        return categories.map(category => ({
            id: category.id.toString(),
            name: category.name.toString(),
            type: category.type.toString()
        }));
    }
}
