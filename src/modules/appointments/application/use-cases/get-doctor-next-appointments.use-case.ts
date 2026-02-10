import { Inject, Injectable } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';

@Injectable()
export class GetDoctorNextAppointmentsUseCase {
    constructor(
        @Inject(IAPPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: IAppointmentRepository,
    ) { }

    async execute(doctorId: string, clientDate?: Date) {
        const referenceDate = clientDate || new Date();

        // Final del día de la fecha de referencia (23:59:59)
        const endOfDay = new Date(referenceDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Buscamos citas que empiecen desde la fecha de referencia hasta el final de ese día
        const appointments = await this.appointmentRepository.findAll({
            doctorId,
            start: referenceDate,
            end: endOfDay,
        });

        // Filtrar por estados activos (PENDIENTE, CONFIRMADA)
        return appointments.filter(app =>
            app.status === AppointmentStatus.PENDIENTE ||
            app.status === AppointmentStatus.CONFIRMADA
        );
    }
}
