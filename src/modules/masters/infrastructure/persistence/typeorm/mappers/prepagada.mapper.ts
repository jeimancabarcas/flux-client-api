import { Prepagada } from '../../../../domain/entities/prepagada.entity';
import { PrepagadaTypeOrmEntity } from '../entities/prepagada.typeorm-entity';

export class PrepagadaMapper {
    static toDomain(entity: PrepagadaTypeOrmEntity): Prepagada {
        return new Prepagada(
            entity.id,
            entity.name,
            entity.isActive,
        );
    }

    static toPersistence(domain: Prepagada): PrepagadaTypeOrmEntity {
        const entity = new PrepagadaTypeOrmEntity();
        if (domain.id) entity.id = domain.id;
        entity.name = domain.name;
        entity.isActive = domain.isActive;
        return entity;
    }
}
