import { Inject, Injectable } from '@nestjs/common';
import { IAPPOINTMENT_REPOSITORY, type IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { Appointment } from '../../domain/entities/appointment.entity';

@Injectable()
export class ListPatientAppointmentsUseCase {
    constructor(
        @Inject(IAPPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: IAppointmentRepository,
    ) { }

    async execute(patientId: string, page: number = 1, limit: number = 10): Promise<{ data: Appointment[]; total: number }> {
        // En el repositorio actual findAll ya soporta patientId
        // Pero findAll devuelve data[] directamente sin total si no se especifica
        // Vamos a ver si el repositorio necesita ajustes o si usamos findAll directamente

        const appointments = await this.appointmentRepository.findAll({
            patientId,
            order: 'DESC',
        });

        // Simular paginación ya que el repositorio findAll actual devuelve todo
        const total = appointments.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedData = appointments.slice(start, end);

        return {
            data: paginatedData,
            total,
        };
    }
}
