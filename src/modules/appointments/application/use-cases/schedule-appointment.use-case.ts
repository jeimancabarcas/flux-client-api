import { Inject, Injectable, ConflictException, ForbiddenException } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { IPRODUCT_SERVICE_REPOSITORY, type IProductServiceRepository } from '../../../masters/domain/repositories/product-service.repository.interface';
import { IINVOICE_REPOSITORY, type IInvoiceRepository } from '../../../billing/domain/repositories/invoice.repository.interface';
import { IPATIENT_REPOSITORY, type IPatientRepository } from '../../../patients/domain/repositories/patient.repository.interface';
import { IAGREEMENT_REPOSITORY, type IAgreementRepository } from '../../../masters/domain/repositories/agreement.repository.interface';
import { Appointment } from '../../domain/entities/appointment.entity';
import { ProductService } from '../../../masters/domain/entities/product-service.entity';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';
import { UserRole } from '../../../../common/enums/user-role.enum';
import { Invoice } from '../../../billing/domain/entities/invoice.entity';
import { InvoiceItem } from '../../../billing/domain/entities/invoice-item.entity';
import { InvoiceStatus } from '../../../billing/domain/entities/invoice-status.enum';
import { ResponsibilityStatus } from '../../../billing/domain/entities/responsibility-status.enum';

@Injectable()
export class ScheduleAppointmentUseCase {
    constructor(
        @Inject(IAPPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: IAppointmentRepository,
        @Inject(IPRODUCT_SERVICE_REPOSITORY)
        private readonly productServiceRepository: IProductServiceRepository,
        @Inject(IINVOICE_REPOSITORY)
        private readonly invoiceRepository: IInvoiceRepository,
        @Inject(IPATIENT_REPOSITORY)
        private readonly patientRepository: IPatientRepository,
        @Inject(IAGREEMENT_REPOSITORY)
        private readonly agreementRepository: IAgreementRepository,
    ) { }

    async execute(
        data: {
            patientId: string;
            doctorId: string;
            startTime: Date;
            durationMinutes?: number;
            reason?: string;
            status?: AppointmentStatus;
            itemIds?: string[];
        },
        user: { id: string, role: string }
    ): Promise<Appointment> {
        // Validación de Médico: si el usuario es médico, solo puede crear citas para sí mismo
        if (user.role === UserRole.MEDICO && user.id !== data.doctorId) {
            throw new ForbiddenException('Un médico solo puede agendar citas para sí mismo.');
        }

        // 1. Duración Inteligente
        let duration = data.durationMinutes;

        if (!duration) {
            const doctorConfigDuration = await this.getDoctorConfigDuration(data.doctorId);
            duration = doctorConfigDuration || 20;
        }

        const startTime = new Date(data.startTime);
        const endTime = new Date(startTime.getTime() + duration * 60000);

        // 2. Validación de Agenda (Cruces)
        const existingAppointments = await this.appointmentRepository.findByDoctorAndRange(
            data.doctorId,
            startTime,
            endTime,
        );

        if (existingAppointments.length > 0) {
            throw new ConflictException(
                'El médico ya tiene una cita programada en este horario o el rango solicitado se cruza con otra cita.',
            );
        }

        // 3. Cargar Items del catálogo
        const items: ProductService[] = [];
        if (data.itemIds && data.itemIds.length > 0) {
            for (const itemId of data.itemIds) {
                const item = await this.productServiceRepository.findById(itemId);
                if (item) items.push(item);
            }
        }

        // 4. Crear y Guardar Cita
        const newAppointment = new Appointment(
            null,
            data.patientId,
            data.doctorId,
            startTime,
            endTime,
            data.status || AppointmentStatus.PENDIENTE,
            data.reason || null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            items,
        );

        const savedAppointment = await this.appointmentRepository.save(newAppointment);

        // 5. Crear Factura Borrador si hay items
        if (items.length > 0 && savedAppointment.id) {
            const patient = await this.patientRepository.findById(data.patientId);
            const invoiceItems: InvoiceItem[] = [];

            for (const item of items) {
                let patientAmount = item.price;
                let entityAmount = 0;
                let entityStatus = ResponsibilityStatus.NOT_APPLICABLE;

                if (patient?.prepagada) {
                    const agreement = await this.agreementRepository.findByProductAndPrepagada(item.id!, patient.prepagada);
                    if (agreement) {
                        patientAmount = agreement.patientAmount;
                        entityAmount = agreement.entityAmount;
                        entityStatus = ResponsibilityStatus.PENDIENTE;
                    }
                }

                invoiceItems.push(new InvoiceItem(
                    null,
                    null,
                    item.id!,
                    item.name,
                    1,
                    item.price,
                    patientAmount,
                    ResponsibilityStatus.PENDIENTE,
                    entityAmount,
                    entityStatus,
                    item.price,
                    null // entityAuthorizationCode starts as null
                ));
            }

            const totalAmount = invoiceItems.reduce((sum, item) => sum + item.totalAmount, 0);

            const draftInvoice = new Invoice(
                null,
                savedAppointment.id,
                data.patientId,
                null,
                totalAmount,
                InvoiceStatus.BORRADOR,
                invoiceItems
            );

            await this.invoiceRepository.save(draftInvoice);
        }

        // Recargar para incluir la factura/items recién creados si el repo lo soporta
        return (await this.appointmentRepository.findById(savedAppointment.id!)) || savedAppointment;
    }

    private async getDoctorConfigDuration(doctorId: string): Promise<number | null> {
        // Simulación de búsqueda en configuración del médico
        // En una implementación real, esto consultaría una tabla de 'doctor_configs' o similar.
        return null;
    }
}
