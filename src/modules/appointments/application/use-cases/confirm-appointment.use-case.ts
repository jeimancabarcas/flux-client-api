import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';
import { Appointment } from '../../domain/entities/appointment.entity';
import { UserRole } from '../../../../common/enums/user-role.enum';

@Injectable()
export class ConfirmAppointmentUseCase {
    constructor(
        @Inject(IAPPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: IAppointmentRepository,
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

        return await this.appointmentRepository.save(updatedAppointment);
    }
}
