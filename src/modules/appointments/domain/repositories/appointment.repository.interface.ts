import { Appointment } from '../entities/appointment.entity';
import { AppointmentStatus } from '../entities/appointment-status.enum';

export interface IAppointmentRepository {
    save(appointment: Appointment): Promise<Appointment>;
    findById(id: string): Promise<Appointment | null>;
    findByDoctorAndRange(
        doctorId: string,
        start: Date,
        end: Date,
    ): Promise<Appointment[]>;
    findAll(filters?: {
        doctorId?: string;
        patientId?: string;
        status?: AppointmentStatus;
        start?: Date;
        end?: Date;
        order?: 'ASC' | 'DESC';
    }): Promise<Appointment[]>;
    delete(id: string): Promise<void>;
}

export const IAPPOINTMENT_REPOSITORY = Symbol('IAppointmentRepository');
