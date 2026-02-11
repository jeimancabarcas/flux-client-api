import { Inject, Injectable } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';

@Injectable()
export class GetDoctorNextAppointmentsUseCase {
    constructor(
        @Inject(IAPPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: IAppointmentRepository,
    ) { }

    async execute(doctorId: string, clientDate?: Date, sort: 'ASC' | 'DESC' = 'DESC') {
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

        // Filtrar por estados requeridos (PENDIENTE, CONFIRMADA, COMPLETADA, EN_CONSULTA)
        const filtered = appointments.filter(app =>
            app.status === AppointmentStatus.PENDIENTE ||
            app.status === AppointmentStatus.CONFIRMADA ||
            app.status === AppointmentStatus.COMPLETADA ||
            app.status === AppointmentStatus.EN_CONSULTA
        );

        // Ordenamiento según parámetro (por defecto DESC)
        return filtered.sort((a, b) => {
            const timeA = a.startTime.getTime();
            const timeB = b.startTime.getTime();
            return sort === 'ASC' ? timeA - timeB : timeB - timeA;
        });
    }
}
