import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IAGREEMENT_REPOSITORY, type IAgreementRepository } from '../../domain/repositories/agreement.repository.interface';
import { Agreement } from '../../domain/entities/agreement.entity';
import { UpdateAgreementDto } from '../../infrastructure/dtos/update-agreement.dto';

@Injectable()
export class UpdateAgreementUseCase {
    constructor(
        @Inject(IAGREEMENT_REPOSITORY)
        private readonly agreementRepository: IAgreementRepository,
    ) { }

    async execute(id: string, dto: UpdateAgreementDto): Promise<Agreement> {
        const agreement = await this.agreementRepository.findById(id);

        if (!agreement) {
            throw new NotFoundException('Convenio no encontrado');
        }

        const updatedAgreement = new Agreement(
            agreement.id,
            dto.productServiceId ?? agreement.productServiceId,
            dto.prepagadaId ?? agreement.prepagadaId,
            dto.patientAmount ?? agreement.patientAmount,
            dto.entityAmount ?? agreement.entityAmount,
            dto.isActive ?? agreement.isActive,
            agreement.createdAt,
            new Date(),
        );

        return await this.agreementRepository.save(updatedAgreement);
    }
}
