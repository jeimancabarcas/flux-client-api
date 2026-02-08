import { Inject, Injectable } from '@nestjs/common';
import { Specialty } from '../../domain/entities/specialty.entity';
import { ISPECIALTY_REPOSITORY, type ISpecialtyRepository } from '../../domain/repositories/specialty.repository.interface';

@Injectable()
export class CreateSpecialtyUseCase {
    constructor(
        @Inject(ISPECIALTY_REPOSITORY)
        private readonly specialtyRepository: ISpecialtyRepository,
    ) { }

    async execute(data: { name: string; description?: string }): Promise<Specialty> {
        const specialty = new Specialty(null, data.name, data.description);
        return this.specialtyRepository.save(specialty);
    }
}
