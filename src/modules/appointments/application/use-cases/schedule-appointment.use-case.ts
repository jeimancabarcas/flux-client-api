import { Inject, Injectable, ConflictException, ForbiddenException } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';
import { UserRole } from '../../../../common/enums/user-role.enum';

@Injectable()
export class ScheduleAppointmentUseCase {
    constructor(
        @Inject(IAPPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: IAppointmentRepository,
    ) { }

    async execute(
        data: {
            patientId: string;
            doctorId: string;
            startTime: Date;
            durationMinutes?: number;
            reason?: string;
            status?: AppointmentStatus;
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

        // 3. Crear y Guardar Cita
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
            [], // Sin items al crear
        );

        const savedAppointment = await this.appointmentRepository.save(newAppointment);

        // Recargar para incluir la factura/items recién creados si el repo lo soporta
        return (await this.appointmentRepository.findById(savedAppointment.id!)) || savedAppointment;
    }

    private async getDoctorConfigDuration(doctorId: string): Promise<number | null> {
        // Simulación de búsqueda en configuración del médico
        // En una implementación real, esto consultaría una tabla de 'doctor_configs' o similar.
        return null;
    }
}
