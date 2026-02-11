import { Inject, Injectable } from '@nestjs/common';
import { IAGREEMENT_REPOSITORY, type IAgreementRepository } from '../../domain/repositories/agreement.repository.interface';
import { Agreement } from '../../domain/entities/agreement.entity';

@Injectable()
export class ListAgreementsUseCase {
    constructor(
        @Inject(IAGREEMENT_REPOSITORY)
        private readonly agreementRepository: IAgreementRepository,
    ) { }

    async execute(filters?: { prepagadaId?: string; isActive?: boolean }): Promise<Agreement[]> {
        return await this.agreementRepository.findAll(filters);
    }
}
