import { PediatricExtension } from './pediatric-extension.entity';
import { PatientBackground } from './patient-background.entity';
import { PhysicalExamination } from './physical-examination.entity';

export class MedicalRecord {
    constructor(
        public readonly id: string | null,
        public appointmentId: string,
        public patientId: string,
        public doctorId: string,
        public reason: string,
        public currentIllness: string,
        public diagnoses: string[], // CIE-11 codes
        public plan: string,
        public physicalExamination: PhysicalExamination | null = null,
        public patientBackground: PatientBackground | null = null,
        public pediatricExtension: PediatricExtension | null = null,
        public readonly createdAt: Date | null = null,
        public readonly updatedAt: Date | null = null,
    ) { }
}
