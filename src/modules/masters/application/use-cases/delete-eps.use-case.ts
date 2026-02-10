import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IEPS_REPOSITORY, type IEpsRepository } from '../../domain/repositories/eps.repository.interface';

@Injectable()
export class DeleteEpsUseCase {
    constructor(
        @Inject(IEPS_REPOSITORY)
        private readonly epsRepository: IEpsRepository,
    ) { }

    async execute(id: string): Promise<void> {
        const existing = await this.epsRepository.findById(id);
        if (!existing) throw new NotFoundException('EPS no encontrada');
        await this.epsRepository.delete(id);
    }
}
