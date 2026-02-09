import { Inject, Injectable, ConflictException, ForbiddenException } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';

@Injectable()
export class ScheduleAppointmentUseCase {
    constructor(
        @Inject(IAPPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: IAppointmentRepository,
    ) { }

    async execute(data: {
        patientId: string;
        doctorId: string;
        startTime: Date;
        durationMinutes?: number;
        reason?: string;
        status?: AppointmentStatus;
    }): Promise<Appointment> {
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

        // 3. Crear y Guardar con estado personalizado
        const newAppointment = new Appointment(
            null,
            data.patientId,
            data.doctorId,
            startTime,
            endTime,
            data.status || AppointmentStatus.PENDIENTE, // Usar el estado proporcionado o PENDIENTE por defecto
            data.reason || null,
            null,
        );

        return this.appointmentRepository.save(newAppointment);
    }

    private async getDoctorConfigDuration(doctorId: string): Promise<number | null> {
        // Simulación de búsqueda en configuración del médico
        // En una implementación real, esto consultaría una tabla de 'doctor_configs' o similar.
        return null;
    }
}
