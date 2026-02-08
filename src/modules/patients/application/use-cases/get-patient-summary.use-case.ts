import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPATIENT_REPOSITORY, type IPatientRepository } from '../../domain/repositories/patient.repository.interface';

@Injectable()
export class GetPatientSummaryUseCase {
    constructor(
        @Inject(IPATIENT_REPOSITORY)
        private readonly patientRepository: IPatientRepository,
    ) { }

    async execute(id: string) {
        const patient = await this.patientRepository.findById(id);
        if (!patient) {
            throw new NotFoundException('Paciente no encontrado');
        }

        // Mock history logic
        const history = [
            { date: '2024-01-15', procedure: 'Consulta General', professional: 'Dr. House', status: 'COMPLETADA' },
            { date: '2024-02-10', procedure: 'Examen de Sangre', professional: 'Lab Central', status: 'PENDIENTE' },
        ];

        return {
            patient,
            clinicalHistory: history,
        };
    }
}
