export class CategoryId {
    private constructor(private readonly value: string) {}

    static create(id: string): CategoryId {
        return new CategoryId(id);
    }

    toString(): string {
        return this.value;
    }
}
