export class EntryId {
    private constructor(private readonly value: string) {}

    static create(id: string): EntryId {
        return new EntryId(id);
    }

    toString(): string {
        return this.value;
    }
}
