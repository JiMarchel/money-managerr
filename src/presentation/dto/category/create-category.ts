import { Static, t } from "elysia";
import { ValidCategoryTypes } from "../../../domain/category/value-objects/category-type";

export const CreateCategoryDto = t.Object({
    name: t.String({ minLength: 1, error: "Category name cannot be empty" }),
    type: t.Union(ValidCategoryTypes.map(type => t.Literal(type)), {
        error: `Category type must be one of: ${ValidCategoryTypes.join(", ")}`
    })
});

export type CreateCategoryDtoType = Static<typeof CreateCategoryDto>;
