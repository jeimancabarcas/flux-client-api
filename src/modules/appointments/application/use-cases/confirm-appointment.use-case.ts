import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';
import { Appointment } from '../../domain/entities/appointment.entity';
import { UserRole } from '../../../../common/enums/user-role.enum';
import { IINVOICE_REPOSITORY, type IInvoiceRepository } from '../../../billing/domain/repositories/invoice.repository.interface';
import { IPATIENT_REPOSITORY, type IPatientRepository } from '../../../patients/domain/repositories/patient.repository.interface';
import { IAGREEMENT_REPOSITORY, type IAgreementRepository } from '../../../masters/domain/repositories/agreement.repository.interface';
import { InvoiceStatus } from '../../../billing/domain/entities/invoice-status.enum';
import { ResponsibilityStatus } from '../../../billing/domain/entities/responsibility-status.enum';

@Injectable()
export class ConfirmAppointmentUseCase {
    constructor(
        @Inject(IAPPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: IAppointmentRepository,
        @Inject(IINVOICE_REPOSITORY)
        private readonly invoiceRepository: IInvoiceRepository,
        @Inject(IPATIENT_REPOSITORY)
        private readonly patientRepository: IPatientRepository,
        @Inject(IAGREEMENT_REPOSITORY)
        private readonly agreementRepository: IAgreementRepository,
    ) { }

    async execute(
        appointmentId: string,
        userRole: string,
    ): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findById(appointmentId);

        if (!appointment) {
            throw new NotFoundException('Cita no encontrada');
        }

        // Solo Admin y Recepcionista pueden confirmar citas
        if (userRole !== UserRole.ADMIN && userRole !== UserRole.RECEPCIONISTA) {
            throw new ForbiddenException('Solo el administrador o un recepcionista pueden confirmar la cita.');
        }

        if (appointment.status !== AppointmentStatus.PENDIENTE) {
            throw new ForbiddenException('Solo se pueden confirmar citas en estado PENDIENTE.');
        }

        const updatedAppointment = new Appointment(
            appointment.id,
            appointment.patientId,
            appointment.doctorId,
            appointment.startTime,
            appointment.endTime,
            AppointmentStatus.CONFIRMADA,
            appointment.reason,
            appointment.notes,
            appointment.actualStartTime,
            appointment.actualEndTime,
            appointment.createdAt,
            new Date(),
            appointment.patient,
            appointment.doctor,
            appointment.items,
        );

        const savedAppointment = await this.appointmentRepository.save(updatedAppointment);

        // Actualizar Factura Borrador a EMITIDA y reaplicar lógica de convenios
        const invoice = await this.invoiceRepository.findByAppointmentId(appointmentId);
        if (invoice && invoice.status === InvoiceStatus.BORRADOR) {
            const patient = await this.patientRepository.findById(appointment.patientId);

            for (const item of invoice.items) {
                let patientAmount = item.unitPrice * item.quantity;
                let entityAmount = 0;
                let entityStatus = ResponsibilityStatus.NOT_APPLICABLE;

                if (patient?.prepagada) {
                    const agreement = await this.agreementRepository.findByProductAndPrepagada(item.productServiceId, patient.prepagada);
                    if (agreement) {
                        patientAmount = agreement.patientAmount * item.quantity;
                        entityAmount = agreement.entityAmount * item.quantity;
                        entityStatus = ResponsibilityStatus.PENDIENTE;
                    }
                }

                item.patientAmount = patientAmount;
                item.entityAmount = entityAmount;
                item.entityStatus = entityStatus;
            }

            invoice.status = InvoiceStatus.EMITIDA;
            await this.invoiceRepository.save(invoice);
        }

        return savedAppointment;
    }
}
