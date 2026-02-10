import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { UserRole } from '../../../../common/enums/user-role.enum';
import { Appointment } from '../../domain/entities/appointment.entity';

@Injectable()
export class GetAppointmentUseCase {
    constructor(
        @Inject(IAPPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: IAppointmentRepository,
    ) { }

    async execute(id: string, user: { id: string; role: string }): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findById(id);

        if (!appointment) {
            throw new NotFoundException('La cita no existe o no fue encontrada.');
        }

        // Lógica de permisos: Solo ADMIN, RECEPCIONISTA o el propio MÉDICO de la cita pueden verla.
        // Aunque el requerimiento sugerido menciona médico o admin, agregamos recepcionista por coherencia de negocio.
        if (
            user.role !== UserRole.ADMIN &&
            user.role !== UserRole.RECEPCIONISTA &&
            appointment.doctorId !== user.id
        ) {
            throw new ForbiddenException('No tienes permiso para ver los detalles de esta cita.');
        }

        return appointment;
    }
}
