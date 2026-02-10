import { Eps } from '../../../../domain/entities/eps.entity';
import { EpsTypeOrmEntity } from '../entities/eps.typeorm-entity';

export class EpsMapper {
    static toDomain(entity: EpsTypeOrmEntity): Eps {
        return new Eps(
            entity.id,
            entity.name,
            entity.isActive,
        );
    }

    static toPersistence(domain: Eps): EpsTypeOrmEntity {
        const entity = new EpsTypeOrmEntity();
        if (domain.id) entity.id = domain.id;
        entity.name = domain.name;
        entity.isActive = domain.isActive;
        return entity;
    }
}
