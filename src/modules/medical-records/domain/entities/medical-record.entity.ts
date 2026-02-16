import { PediatricExtension } from './pediatric-extension.entity';
import { PatientBackground } from './patient-background.entity';
import { PhysicalExamination } from './physical-examination.entity';

export interface Diagnosis {
    code: string;
    description: string;
    type: string;
}

export interface Prescription {
    cum: string; // Código CUMS / Expediente-Consecutivo
    name: string; // Nombre del medicamento
    dosage: string; // Dosis (ej: 500mg)
    frequency: string; // Frecuencia (ej: cada 8 horas)
    duration: string; // Duración (ej: 7 días)
    instructions?: string; // Indicaciones adicionales
}

export class MedicalRecord {
    constructor(
        public readonly id: string | null,
        public appointmentId: string,
        public patientId: string,
        public doctorId: string,
        public reason: string,
        public currentIllness: string,
        public diagnoses: Diagnosis[], // CIE-11 codes and descriptions
        public prescriptions: Prescription[], // CUMS medications
        public plan: string,
        public physicalExamination: PhysicalExamination | null = null,
        public patientBackground: PatientBackground | null = null,
        public pediatricExtension: PediatricExtension | null = null,
        public readonly createdAt: Date | null = null,
        public readonly updatedAt: Date | null = null,
    ) { }
}
