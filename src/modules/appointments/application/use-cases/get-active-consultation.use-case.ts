import { Inject, Injectable } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';
import { Appointment } from '../../domain/entities/appointment.entity';

@Injectable()
export class GetActiveConsultationUseCase {
    constructor(
        @Inject(IAPPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: IAppointmentRepository,
    ) { }

    async execute(doctorId: string): Promise<Appointment | null> {
        const appointments = await this.appointmentRepository.findAll({
            doctorId,
            status: AppointmentStatus.EN_CONSULTA,
        });

        return appointments.length > 0 ? appointments[0] : null;
    }
}
