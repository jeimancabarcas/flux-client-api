import { MedicalRecord } from '../entities/medical-record.entity';

export interface IMedicalRecordRepository {
    save(medicalRecord: MedicalRecord): Promise<MedicalRecord>;
    findById(id: string): Promise<MedicalRecord | null>;
    findByAppointmentId(appointmentId: string): Promise<MedicalRecord[]>;
    findByPatientId(patientId: string, page?: number, limit?: number): Promise<MedicalRecord[]>;
}

export const IMEDICAL_RECORD_REPOSITORY = 'IMEDICAL_RECORD_REPOSITORY';
