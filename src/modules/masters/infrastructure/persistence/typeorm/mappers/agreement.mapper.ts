import { Agreement } from '../../../../domain/entities/agreement.entity';
import { AgreementTypeOrmEntity } from '../entities/agreement.typeorm-entity';

export class AgreementMapper {
    static toDomain(entity: AgreementTypeOrmEntity): Agreement {
        return new Agreement(
            entity.id,
            entity.productServiceId,
            entity.prepagadaId,
            Number(entity.patientAmount),
            Number(entity.entityAmount),
            entity.isActive,
            entity.createdAt,
            entity.updatedAt,
        );
    }

    static toPersistence(domain: Agreement): AgreementTypeOrmEntity {
        const entity = new AgreementTypeOrmEntity();
        if (domain.id) entity.id = domain.id;
        entity.productServiceId = domain.productServiceId;
        entity.prepagadaId = domain.prepagadaId;
        entity.patientAmount = domain.patientAmount;
        entity.entityAmount = domain.entityAmount;
        entity.isActive = domain.isActive;
        return entity;
    }
}
