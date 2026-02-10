import { Inject, Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';
import { Appointment } from '../../domain/entities/appointment.entity';
import { UserRole } from '../../../../common/enums/user-role.enum';

@Injectable()
export class StartAppointmentUseCase {
    constructor(
        @Inject(IAPPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: IAppointmentRepository,
    ) { }

    async execute(
        appointmentId: string,
        user: { id: string; role: string },
    ): Promise<void> {
        const appointment = await this.appointmentRepository.findById(appointmentId);

        if (!appointment) {
            throw new NotFoundException('Cita no encontrada');
        }

        // Solo el médico asignado o un Admin pueden iniciar la cita
        if (user.role === UserRole.MEDICO && appointment.doctorId !== user.id) {
            throw new ForbiddenException('No puedes iniciar las citas de otro médico.');
        }

        if (user.role !== UserRole.MEDICO && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Solo el médico o un administrador pueden iniciar la cita.');
        }

        // Validación de consulta en curso
        const activeConsultation = await this.appointmentRepository.findAll({
            doctorId: appointment.doctorId,
            status: AppointmentStatus.EN_CONSULTA
        });

        if (activeConsultation.length > 0) {
            throw new ConflictException('Debe terminar la consulta que tiene en curso primero antes de iniciar una nueva.');
        }

        if (appointment.status !== AppointmentStatus.PENDIENTE && appointment.status !== AppointmentStatus.CONFIRMADA) {
            throw new ForbiddenException('Solo se pueden iniciar citas en estado PENDIENTE o CONFIRMADA.');
        }

        const updatedAppointment = new Appointment(
            appointment.id,
            appointment.patientId,
            appointment.doctorId,
            appointment.startTime,
            appointment.endTime,
            AppointmentStatus.EN_CONSULTA,
            appointment.reason,
            appointment.notes,
            new Date(), // Captura inicio real
            appointment.actualEndTime,
            appointment.createdAt,
            new Date(),
        );

        await this.appointmentRepository.save(updatedAppointment);
    }
}
