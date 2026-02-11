import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IAGREEMENT_REPOSITORY, type IAgreementRepository } from '../../domain/repositories/agreement.repository.interface';

@Injectable()
export class DeleteAgreementUseCase {
    constructor(
        @Inject(IAGREEMENT_REPOSITORY)
        private readonly agreementRepository: IAgreementRepository,
    ) { }

    async execute(id: string): Promise<void> {
        const agreement = await this.agreementRepository.findById(id);

        if (!agreement) {
            throw new NotFoundException('Convenio no encontrado');
        }

        await this.agreementRepository.delete(id);
    }
}
