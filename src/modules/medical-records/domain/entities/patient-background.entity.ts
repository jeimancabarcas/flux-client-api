export class PatientBackground {
    constructor(
        public readonly id: string | null,
        public medicalRecordId: string | null,
        public pathological: string | null = null,
        public surgical: string | null = null,
        public allergic: string | null = null,
        public pharmacological: string | null = null,
        public familyHistory: string | null = null,
        public reviewOfSystems: string | null = null,
        public readonly createdAt: Date | null = null,
        public readonly updatedAt: Date | null = null,
    ) { }
}
