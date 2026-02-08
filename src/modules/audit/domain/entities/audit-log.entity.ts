export class AuditLog {
    constructor(
        public readonly id: string | null,
        public readonly userId: string | null,
        public readonly email: string | null,
        public readonly path: string,
        public readonly method: string,
        public readonly statusCode: number | null,
        public readonly ip: string,
        public readonly device: string,
        public readonly timestamp: Date,
        public readonly payload: any | null = null,
    ) { }
}
