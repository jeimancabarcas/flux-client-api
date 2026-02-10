import { Inject, Injectable } from '@nestjs/common';
import { IEPS_REPOSITORY, type IEpsRepository } from '../../domain/repositories/eps.repository.interface';
import { Eps } from '../../domain/entities/eps.entity';
import { CreateEpsDto } from '../../infrastructure/dtos/create-eps.dto';

@Injectable()
export class CreateEpsUseCase {
    constructor(
        @Inject(IEPS_REPOSITORY)
        private readonly epsRepository: IEpsRepository,
    ) { }

    async execute(dto: CreateEpsDto): Promise<Eps> {
        const eps = new Eps(
            null,
            dto.name,
            dto.isActive ?? true,
        );
        return this.epsRepository.save(eps);
    }
}
