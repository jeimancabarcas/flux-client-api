import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';
import { UserRole } from '../../../../common/enums/user-role.enum';

@Injectable()
export class UpdateAppointmentStatusUseCase {
    constructor(
        @Inject(IAPPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: IAppointmentRepository,
    ) { }

    async execute(
        appointmentId: string,
        newStatus: AppointmentStatus,
        user: { id: string; role: string },
    ): Promise<void> {
        const appointment = await this.appointmentRepository.findById(appointmentId);

        if (!appointment) {
            throw new NotFoundException('Cita no encontrada');
        }

        // Lógica por Roles
        if (user.role === UserRole.RECEPCIONISTA) {
            if (newStatus !== AppointmentStatus.CANCELADA) {
                throw new ForbiddenException(
                    'La recepcionista solo puede cancelar citas.',
                );
            }
        } else if (user.role === UserRole.MEDICO) {
            // Validar que sea su propia cita
            if (appointment.doctorId !== user.id) {
                throw new ForbiddenException('No puedes gestionar las citas de otro médico.');
            }

            const allowedForMedico = [
                AppointmentStatus.EN_CONSULTA,
                AppointmentStatus.COMPLETADA,
                AppointmentStatus.CANCELADA,
            ];

            if (!allowedForMedico.includes(newStatus)) {
                throw new ForbiddenException(
                    'El médico solo puede marcar como En Consulta, Completada o Cancelada.',
                );
            }
        } else if (user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('No tienes permisos para cambiar el estado de la cita.');
        }

        await this.appointmentRepository.updateStatus(appointmentId, newStatus);
    }
}
