import { Inject, Injectable } from '@nestjs/common';
import { IPREPAGADA_REPOSITORY, type IPrepagadaRepository } from '../../domain/repositories/prepagada.repository.interface';
import { Prepagada } from '../../domain/entities/prepagada.entity';
import { CreatePrepagadaDto } from '../../infrastructure/dtos/create-prepagada.dto';

@Injectable()
export class CreatePrepagadaUseCase {
    constructor(
        @Inject(IPREPAGADA_REPOSITORY)
        private readonly prepagadaRepository: IPrepagadaRepository,
    ) { }

    async execute(dto: CreatePrepagadaDto): Promise<Prepagada> {
        const prepagada = new Prepagada(
            null,
            dto.name,
            dto.isActive ?? true,
        );
        return this.prepagadaRepository.save(prepagada);
    }
}
