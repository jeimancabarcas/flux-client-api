import { Patient } from '../entities/patient.entity';

export interface IPatientRepository {
    save(patient: Patient): Promise<Patient>;
    findByIdentification(numeroIdentificacion: string): Promise<Patient | null>;
    findByNumeroIdentificacion(numeroIdentificacion: string): Promise<Patient | null>;
    findById(id: string): Promise<Patient | null>;
    findAll(filters?: {
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{ data: Patient[]; total: number }>;
    update(id: string, patient: Patient): Promise<Patient>;
}

export const IPATIENT_REPOSITORY = Symbol('IPatientRepository');
