import { Injectable, Inject } from '@nestjs/common';
import { ICUMS_REPOSITORY, type ICumsRepository } from '../../domain/repositories/cums.repository.interface';
import { Cum } from '../../domain/entities/cum.entity';

@Injectable()
export class SearchCumsUseCase {
    constructor(
        @Inject(ICUMS_REPOSITORY)
        private readonly cumsRepository: ICumsRepository,
    ) { }

    async execute(term: string): Promise<Cum[]> {
        if (!term || term.trim().length < 3) {
            return [];
        }
        return await this.cumsRepository.search(term.trim());
    }
}
