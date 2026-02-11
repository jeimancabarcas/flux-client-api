import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';
import { Appointment } from '../../domain/entities/appointment.entity';
import { UserRole } from '../../../../common/enums/user-role.enum';
import { IPRODUCT_SERVICE_REPOSITORY, type IProductServiceRepository } from '../../../masters/domain/repositories/product-service.repository.interface';
import { IINVOICE_REPOSITORY, type IInvoiceRepository } from '../../../billing/domain/repositories/invoice.repository.interface';
import { IPATIENT_REPOSITORY, type IPatientRepository } from '../../../patients/domain/repositories/patient.repository.interface';
import { IAGREEMENT_REPOSITORY, type IAgreementRepository } from '../../../masters/domain/repositories/agreement.repository.interface';
import { IPREPAGADA_REPOSITORY, type IPrepagadaRepository } from '../../../masters/domain/repositories/prepagada.repository.interface';
import { InvoiceItem } from '../../../billing/domain/entities/invoice-item.entity';
import { InvoiceStatus } from '../../../billing/domain/entities/invoice-status.enum';
import { ResponsibilityStatus } from '../../../billing/domain/entities/responsibility-status.enum';
import { Invoice } from '../../../billing/domain/entities/invoice.entity';

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
        @Inject(IPRODUCT_SERVICE_REPOSITORY)
        private readonly productServiceRepository: IProductServiceRepository,
        @Inject(IPREPAGADA_REPOSITORY)
        private readonly prepagadaRepository: IPrepagadaRepository,
    ) { }

    async execute(
        appointmentId: string,
        userRole: string,
        data?: {
            itemIds?: string[];
            paymentType?: string;
            prepagadaId?: string;
            authorizationCode?: string;
        }
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

        // 1. Actualizar o Crear Factura PRIMERO
        let invoice = await this.invoiceRepository.findByAppointmentId(appointmentId);
        const patient = await this.patientRepository.findById(appointment.patientId);
        const prepagadaId = data?.prepagadaId || patient?.prepagada;

        if (!invoice) {
            // Crear nueva factura si no existe
            invoice = new Invoice(
                null,
                appointmentId,
                appointment.patientId,
                null,
                0,
                InvoiceStatus.EMITIDA,
                []
            );
        }

        if (invoice.status === InvoiceStatus.BORRADOR || invoice.id === null) {
            // Si se envían nuevos itemIds, actualizamos la lista de items de la factura
            if (data?.itemIds && data.itemIds.length > 0) {
                const newItems: InvoiceItem[] = [];
                for (const itemId of data.itemIds) {
                    const product = await this.productServiceRepository.findById(itemId);
                    if (product) {
                        newItems.push(new InvoiceItem(
                            null,
                            invoice.id,
                            product.id!,
                            product.name,
                            1,
                            product.price,
                            product.price,
                            ResponsibilityStatus.PAGADO, // Parte del cliente marcada como pagada
                            0,
                            ResponsibilityStatus.NOT_APPLICABLE,
                            product.price,
                            null
                        ));
                    }
                }
                invoice.items = newItems;
            }

            for (const item of invoice.items) {
                let patientAmount = item.unitPrice * item.quantity;
                let entityAmount = 0;
                let entityStatus = ResponsibilityStatus.NOT_APPLICABLE;
                let authCode = data?.authorizationCode || null;

                // Aplicar lógica de convenio
                if (prepagadaId && (data?.paymentType === 'CONVENIO' || !data?.paymentType)) {
                    let resolvedPrepagadaId = prepagadaId;
                    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resolvedPrepagadaId);

                    if (!isUuid) {
                        const pp = await this.prepagadaRepository.findByName(resolvedPrepagadaId);
                        resolvedPrepagadaId = pp ? pp.id! : '';
                    }

                    if (resolvedPrepagadaId) {
                        const agreement = await this.agreementRepository.findByProductAndPrepagada(item.productServiceId, resolvedPrepagadaId);
                        if (agreement) {
                            patientAmount = agreement.patientAmount * item.quantity;
                            entityAmount = agreement.entityAmount * item.quantity;
                            entityStatus = ResponsibilityStatus.PENDIENTE;
                        }
                    }
                }

                item.patientAmount = patientAmount;
                item.patientStatus = ResponsibilityStatus.PAGADO; // Siempre pagado al confirmar
                item.entityAmount = entityAmount;
                item.entityStatus = entityAmount > 0 ? ResponsibilityStatus.PENDIENTE : ResponsibilityStatus.NOT_APPLICABLE;
                item.entityAuthorizationCode = entityAmount > 0 ? authCode : null;
            }

            invoice.status = InvoiceStatus.EMITIDA;
            invoice.totalAmount = invoice.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

            await this.invoiceRepository.save(invoice);
        }

        // 2. Confirmar Cita DESPUÉS
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

        return await this.appointmentRepository.save(updatedAppointment);
    }
}
