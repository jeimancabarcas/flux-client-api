import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPREPAGADA_REPOSITORY, type IPrepagadaRepository } from '../../domain/repositories/prepagada.repository.interface';
import { Prepagada } from '../../domain/entities/prepagada.entity';
import { UpdatePrepagadaDto } from '../../infrastructure/dtos/update-prepagada.dto';

@Injectable()
export class UpdatePrepagadaUseCase {
    constructor(
        @Inject(IPREPAGADA_REPOSITORY)
        private readonly prepagadaRepository: IPrepagadaRepository,
    ) { }

    async execute(id: string, dto: UpdatePrepagadaDto): Promise<Prepagada> {
        const existing = await this.prepagadaRepository.findById(id);
        if (!existing) throw new NotFoundException('Medicina prepagada no encontrada');

        const updated = new Prepagada(
            existing.id,
            dto.name ?? existing.name,
            dto.isActive ?? existing.isActive,
        );
        return this.prepagadaRepository.save(updated);
    }
}
