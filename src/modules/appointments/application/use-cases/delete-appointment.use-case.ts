import { Inject, Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';
import { UserRole } from '../../../../common/enums/user-role.enum';

@Injectable()
export class DeleteAppointmentUseCase {
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

        // Solo Recepcionista y Admin pueden eliminar citas del calendario
        const permittedRoles = [UserRole.ADMIN, UserRole.RECEPCIONISTA];
        if (!permittedRoles.includes(user.role as UserRole)) {
            throw new ForbiddenException('No tienes permisos para eliminar la cita del calendario.');
        }

        // Solo se pueden eliminar si están CANCELADAS (según requerimiento)
        if (appointment.status !== AppointmentStatus.CANCELADA) {
            throw new BadRequestException(`Solo se pueden eliminar del calendario citas que ya han sido CANCELADAS. Estado actual: ${appointment.status}`);
        }

        await this.appointmentRepository.delete(appointmentId);
    }
}
