import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPREPAGADA_REPOSITORY, type IPrepagadaRepository } from '../../domain/repositories/prepagada.repository.interface';

@Injectable()
export class DeletePrepagadaUseCase {
    constructor(
        @Inject(IPREPAGADA_REPOSITORY)
        private readonly prepagadaRepository: IPrepagadaRepository,
    ) { }

    async execute(id: string): Promise<void> {
        const existing = await this.prepagadaRepository.findById(id);
        if (!existing) throw new NotFoundException('Medicina prepagada no encontrada');
        await this.prepagadaRepository.delete(id);
    }
}
