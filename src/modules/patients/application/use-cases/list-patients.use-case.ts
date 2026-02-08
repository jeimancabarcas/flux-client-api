import { Inject, Injectable } from '@nestjs/common';
import { IPATIENT_REPOSITORY, type IPatientRepository } from '../../domain/repositories/patient.repository.interface';

@Injectable()
export class ListPatientsUseCase {
    constructor(
        @Inject(IPATIENT_REPOSITORY)
        private readonly patientRepository: IPatientRepository,
    ) { }

    async execute(page: number = 1, limit: number = 10, search?: string) {
        const { data, total } = await this.patientRepository.findAll({
            page,
            limit,
            search,
        });

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
