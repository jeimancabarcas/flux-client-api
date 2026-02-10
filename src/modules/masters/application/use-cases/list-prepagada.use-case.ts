import { Inject, Injectable } from '@nestjs/common';
import { IPREPAGADA_REPOSITORY, type IPrepagadaRepository } from '../../domain/repositories/prepagada.repository.interface';
import { Prepagada } from '../../domain/entities/prepagada.entity';

@Injectable()
export class ListPrepagadaUseCase {
    constructor(
        @Inject(IPREPAGADA_REPOSITORY)
        private readonly prepagadaRepository: IPrepagadaRepository,
    ) { }

    async execute(): Promise<Prepagada[]> {
        return this.prepagadaRepository.findAll();
    }
}
