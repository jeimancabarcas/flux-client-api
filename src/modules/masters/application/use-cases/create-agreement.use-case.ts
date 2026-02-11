import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { IAGREEMENT_REPOSITORY, type IAgreementRepository } from '../../domain/repositories/agreement.repository.interface';
import { Agreement } from '../../domain/entities/agreement.entity';
import { CreateAgreementDto } from '../../infrastructure/dtos/create-agreement.dto';

@Injectable()
export class CreateAgreementUseCase {
    constructor(
        @Inject(IAGREEMENT_REPOSITORY)
        private readonly agreementRepository: IAgreementRepository,
    ) { }

    async execute(dto: CreateAgreementDto): Promise<Agreement> {
        const existing = await this.agreementRepository.findByProductAndPrepagada(
            dto.productServiceId,
            dto.prepagadaId
        );

        if (existing) {
            throw new ConflictException('Ya existe un convenio activo para este producto y prepagada.');
        }

        const agreement = new Agreement(
            null,
            dto.productServiceId,
            dto.prepagadaId,
            dto.patientAmount,
            dto.entityAmount,
            dto.isActive ?? true,
        );

        return await this.agreementRepository.save(agreement);
    }
}
