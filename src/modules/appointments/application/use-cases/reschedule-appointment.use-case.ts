import { Inject, Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';
import { Appointment } from '../../domain/entities/appointment.entity';
import { UserRole } from '../../../../common/enums/user-role.enum';

@Injectable()
export class RescheduleAppointmentUseCase {
    constructor(
        @Inject(IAPPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: IAppointmentRepository,
    ) { }

    async execute(
        appointmentId: string,
        startTime: Date,
        durationMinutes: number,
        user: { id: string; role: string },
    ): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findById(appointmentId);

        if (!appointment) {
            throw new NotFoundException('Cita no encontrada');
        }

        // Solo Recepcionista y Admin pueden reprogramar
        const permittedRoles = [UserRole.ADMIN, UserRole.RECEPCIONISTA];
        if (!permittedRoles.includes(user.role as UserRole)) {
            throw new ForbiddenException('No tienes permisos para reprogramar la cita.');
        }

        // Solo se puede reprogramar si está PENDIENTE
        if (appointment.status !== AppointmentStatus.PENDIENTE) {
            throw new BadRequestException(`Solo se pueden reprogramar citas en estado PENDIENTE. Estado actual: ${appointment.status}`);
        }

        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

        const updatedAppointment = new Appointment(
            appointment.id,
            appointment.patientId,
            appointment.doctorId,
            startTime,
            endTime,
            appointment.status,
            appointment.reason,
            appointment.notes,
            appointment.actualStartTime,
            appointment.actualEndTime,
            appointment.createdAt,
            new Date(), // updatedAt
        );

        return await this.appointmentRepository.save(updatedAppointment);
    }
}
