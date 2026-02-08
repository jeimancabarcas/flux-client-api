import { Inject, Injectable } from '@nestjs/common';
import { Patient } from '../../domain/entities/patient.entity';
import { IPATIENT_REPOSITORY, type IPatientRepository } from '../../domain/repositories/patient.repository.interface';

@Injectable()
export class SearchPatientUseCase {
    constructor(
        @Inject(IPATIENT_REPOSITORY)
        private readonly patientRepository: IPatientRepository,
    ) { }

    async execute(query: string): Promise<Patient[]> {
        return this.patientRepository.findAll({ search: query });
    }
}
