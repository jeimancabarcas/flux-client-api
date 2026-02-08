import { Inject, Injectable, ConflictException, ForbiddenException } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { Appointment } from '../../domain/entities/appointment.entity';

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
    }): Promise<Appointment> {
        // 1. Duración Inteligente
        let duration = data.durationMinutes;

        if (!duration) {
            // Prioridad: 1. Manual, 2. Configuración (Simulada para este caso), 3. Defecto 20m
            // Aquí podrías inyectar un ConfigService o Repo de Médicos para buscar el valor real.
            // Por simplicidad en este paso, asumiremos que si no viene manual, buscamos en una "configuración" que por ahora retorna null.
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

        // 3. Crear y Guardar
        const appointment = new Appointment(
            null,
            data.patientId,
            data.doctorId,
            startTime,
            endTime,
            data.reason ? (data.reason as any) : null, // Fix: use create logic or direct constructor
            null as any,
            null,
        );

        // Re-uso de lógica de creación controlada
        const newAppointment = Appointment.create(
            data.patientId,
            data.doctorId,
            startTime,
            duration,
            data.reason
        );

        return this.appointmentRepository.save(newAppointment);
    }

    private async getDoctorConfigDuration(doctorId: string): Promise<number | null> {
        // Simulación de búsqueda en configuración del médico
        // En una implementación real, esto consultaría una tabla de 'doctor_configs' o similar.
        return null;
    }
}
