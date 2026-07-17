import { InvalidDirectionError } from "../error";

export const ValidDirections = ["IN", "OUT"] as const;
export type DirectionEnum = typeof ValidDirections[number];

export class Direction {
    private constructor(private readonly value: DirectionEnum) {}

    static create(direction: string): Direction {
        if (!ValidDirections.includes(direction as DirectionEnum)) {
            throw new InvalidDirectionError(`Invalid direction: ${direction}. Must be 'IN' or 'OUT'`);
        }
        return new Direction(direction as DirectionEnum);
    }

    toString(): string {
        return this.value;
    }
}
