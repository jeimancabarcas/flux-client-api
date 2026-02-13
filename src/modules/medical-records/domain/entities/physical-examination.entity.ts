export class PhysicalExamination {
    constructor(
        public readonly id: string | null,
        public medicalRecordId: string | null,
        public content: string | null = null,
        // Signos Vitales
        public heartRate: number | null = null,
        public respiratoryRate: number | null = null,
        public temperature: number | null = null,
        public systolicBloodPressure: number | null = null,
        public diastolicBloodPressure: number | null = null,
        public weight: number | null = null,
        public height: number | null = null,
        public readonly createdAt: Date | null = null,
        public readonly updatedAt: Date | null = null,
    ) { }
}
