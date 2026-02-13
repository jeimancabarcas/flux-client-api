export class PediatricExtension {
    constructor(
        public readonly id: string | null,
        public medicalRecordId: string | null,
        public weight: number | null,
        public height: number | null,
        public cephalicPerimeter: number | null,
        public abdominalPerimeter: number | null,
        public perinatalHistory: string | null,
        public readonly createdAt: Date | null = null,
        public readonly updatedAt: Date | null = null,
    ) { }
}
