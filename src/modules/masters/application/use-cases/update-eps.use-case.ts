import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IEPS_REPOSITORY, type IEpsRepository } from '../../domain/repositories/eps.repository.interface';
import { Eps } from '../../domain/entities/eps.entity';
import { UpdateEpsDto } from '../../infrastructure/dtos/update-eps.dto';

@Injectable()
export class UpdateEpsUseCase {
    constructor(
        @Inject(IEPS_REPOSITORY)
        private readonly epsRepository: IEpsRepository,
    ) { }

    async execute(id: string, dto: UpdateEpsDto): Promise<Eps> {
        const existing = await this.epsRepository.findById(id);
        if (!existing) throw new NotFoundException('EPS no encontrada');

        const updated = new Eps(
            existing.id,
            dto.name ?? existing.name,
            dto.isActive ?? existing.isActive,
        );
        return this.epsRepository.save(updated);
    }
}
