export class SessionId {
    private constructor(public readonly value: string) { }

    static create(sessionId: string): SessionId {

        return new SessionId(sessionId)
    }

    toString(): string {
        return this.value;
    }
}