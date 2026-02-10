import { Inject, Injectable } from '@nestjs/common';
import { IEPS_REPOSITORY, type IEpsRepository } from '../../domain/repositories/eps.repository.interface';
import { Eps } from '../../domain/entities/eps.entity';

@Injectable()
export class ListEpsUseCase {
    constructor(
        @Inject(IEPS_REPOSITORY)
        private readonly epsRepository: IEpsRepository,
    ) { }

    async execute(): Promise<Eps[]> {
        return this.epsRepository.findAll();
    }
}
