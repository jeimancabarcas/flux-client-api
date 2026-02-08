import { Inject, Injectable } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';
import { UserRole } from '../../../../common/enums/user-role.enum';

@Injectable()
export class ListAppointmentsUseCase {
    constructor(
        @Inject(IAPPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: IAppointmentRepository,
    ) { }

    async execute(user: { id: string; role: string }, filters?: {
        patientId?: string;
        doctorId?: string;
        status?: AppointmentStatus;
        start?: Date;
        end?: Date;
    }) {
        // Si es médico, solo ve su agenda a menos que sea Admin o Recepcionista
        const effectiveFilters = { ...filters };

        if (user.role === UserRole.MEDICO) {
            effectiveFilters.doctorId = user.id;
        }

        return this.appointmentRepository.findAll(effectiveFilters);
    }
}
