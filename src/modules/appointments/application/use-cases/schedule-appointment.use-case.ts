import { Inject, Injectable, ConflictException, ForbiddenException } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { IPRODUCT_SERVICE_REPOSITORY, type IProductServiceRepository } from '../../../masters/domain/repositories/product-service.repository.interface';
import { Appointment } from '../../domain/entities/appointment.entity';
import { ProductService } from '../../../masters/domain/entities/product-service.entity';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';
import { UserRole } from '../../../../common/enums/user-role.enum';

@Injectable()
export class ScheduleAppointmentUseCase {
    constructor(
        @Inject(IAPPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: IAppointmentRepository,
        @Inject(IPRODUCT_SERVICE_REPOSITORY)
        private readonly productServiceRepository: IProductServiceRepository,
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

        // 4. Crear y Guardar con estado personalizado
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

        return this.appointmentRepository.save(newAppointment);
    }

    private async getDoctorConfigDuration(doctorId: string): Promise<number | null> {
        // Simulación de búsqueda en configuración del médico
        // En una implementación real, esto consultaría una tabla de 'doctor_configs' o similar.
        return null;
    }
}
