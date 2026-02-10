import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPATIENT_REPOSITORY, type IPatientRepository } from '../../domain/repositories/patient.repository.interface';
import { Patient } from '../../domain/entities/patient.entity';

@Injectable()
export class GetPatientUseCase {
    constructor(
        @Inject(IPATIENT_REPOSITORY)
        private readonly patientRepository: IPatientRepository,
    ) { }

    async execute(id: string): Promise<Patient> {
        const patient = await this.patientRepository.findById(id);
        if (!patient) {
            throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
        }
        return patient;
    }
}
