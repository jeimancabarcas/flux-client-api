import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';
import { Appointment } from '../../domain/entities/appointment.entity';
import { UserRole } from '../../../../common/enums/user-role.enum';

@Injectable()
export class CompleteAppointmentUseCase {
    constructor(
        @Inject(IAPPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: IAppointmentRepository,
    ) { }

    async execute(
        appointmentId: string,
        user: { id: string; role: string },
        notes?: string,
    ): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findById(appointmentId);

        if (!appointment) {
            throw new NotFoundException('Cita no encontrada');
        }

        // Solo el médico asignado o un Admin pueden completar la cita
        if (user.role === UserRole.MEDICO && appointment.doctorId !== user.id) {
            throw new ForbiddenException('No puedes completar las citas de otro médico.');
        }

        if (user.role !== UserRole.MEDICO && user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Solo el médico o un administrador pueden completar la cita.');
        }

        if (appointment.status !== AppointmentStatus.EN_CONSULTA) {
            throw new ForbiddenException('Para completar la cita, primero debe estar EN_CONSULTA.');
        }

        const updatedAppointment = new Appointment(
            appointment.id,
            appointment.patientId,
            appointment.doctorId,
            appointment.startTime,
            appointment.endTime,
            AppointmentStatus.COMPLETADA,
            appointment.reason,
            notes ?? appointment.notes,
            appointment.actualStartTime,
            new Date(), // Captura fin real
            appointment.createdAt,
            new Date(),
            appointment.patient,
            appointment.doctor,
            appointment.items,
        );

        return await this.appointmentRepository.save(updatedAppointment);
    }
}
