import { Inject, Injectable } from '@nestjs/common';
import { Specialty } from '../../domain/entities/specialty.entity';
import { ISPECIALTY_REPOSITORY, type ISpecialtyRepository } from '../../domain/repositories/specialty.repository.interface';

@Injectable()
export class ListSpecialtiesUseCase {
    constructor(
        @Inject(ISPECIALTY_REPOSITORY)
        private readonly specialtyRepository: ISpecialtyRepository,
    ) { }

    async execute(): Promise<Specialty[]> {
        return this.specialtyRepository.findAll();
    }
}
