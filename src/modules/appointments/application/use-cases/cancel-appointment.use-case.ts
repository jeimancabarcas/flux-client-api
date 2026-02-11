import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';
import { Appointment } from '../../domain/entities/appointment.entity';
import { UserRole } from '../../../../common/enums/user-role.enum';

@Injectable()
export class CancelAppointmentUseCase {
    constructor(
        @Inject(IAPPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: IAppointmentRepository,
    ) { }

    async execute(
        appointmentId: string,
        user: { id: string; role: string },
        reason?: string,
    ): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findById(appointmentId);

        if (!appointment) {
            throw new NotFoundException('Cita no encontrada');
        }

        // Recepcionista, Médico asignado y Admin pueden cancelar
        if (user.role === UserRole.MEDICO && appointment.doctorId !== user.id) {
            throw new ForbiddenException('No puedes cancelar las citas de otro médico.');
        }

        const permittedRoles = [UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.MEDICO];
        if (!permittedRoles.includes(user.role as UserRole)) {
            throw new ForbiddenException('No tienes permisos para cancelar la cita.');
        }

        if (appointment.status === AppointmentStatus.COMPLETADA || appointment.status === AppointmentStatus.CANCELADA) {
            throw new ForbiddenException('No se puede cancelar una cita que ya ha terminado o ya fue cancelada.');
        }

        const updatedAppointment = new Appointment(
            appointment.id,
            appointment.patientId,
            appointment.doctorId,
            appointment.startTime,
            appointment.endTime,
            AppointmentStatus.CANCELADA,
            reason ?? appointment.reason,
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
