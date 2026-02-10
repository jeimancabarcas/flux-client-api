import { Inject, Injectable } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY } from '../../domain/repositories/appointment.repository.interface';
import type { IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';

@Injectable()
export class GetPatientNextAppointmentUseCase {
    constructor(
        @Inject(IAPPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: IAppointmentRepository,
    ) { }

    async execute(patientId: string, fromDate?: Date): Promise<Appointment | null> {
        const referenceDate = fromDate || new Date();

        const appointments = await this.appointmentRepository.findAll({
            patientId,
            start: referenceDate, // Desde la fecha de referencia
            end: new Date(referenceDate.getTime() + 365 * 24 * 60 * 60 * 1000), // Hasta 1 año después
        });

        // Filtrar solo las que están en estado PENDIENTE o CONFIRMADA
        const nextAppointment = appointments.find(app =>
            app.status === AppointmentStatus.PENDIENTE ||
            app.status === AppointmentStatus.CONFIRMADA
        );

        return nextAppointment || null;
    }
}
