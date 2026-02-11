import { Invoice } from '../entities/invoice.entity';

export interface IInvoiceRepository {
    save(invoice: Invoice): Promise<Invoice>;
    findById(id: string): Promise<Invoice | null>;
    findByAppointmentId(appointmentId: string): Promise<Invoice | null>;
    findByPatientId(patientId: string): Promise<Invoice[]>;
}

export const IINVOICE_REPOSITORY = Symbol('IInvoiceRepository');
