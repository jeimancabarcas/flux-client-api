import { Specialty } from '../../../../domain/entities/specialty.entity';
import { SpecialtyTypeOrmEntity } from '../entities/specialty.typeorm-entity';

export class SpecialtyMapper {
    static toDomain(entity: SpecialtyTypeOrmEntity): Specialty {
        return new Specialty(entity.id, entity.name, entity.description);
    }

    static toPersistence(domain: Specialty): SpecialtyTypeOrmEntity {
        const entity = new SpecialtyTypeOrmEntity();
        if (domain.id) entity.id = domain.id;
        entity.name = domain.name;
        entity.description = domain.description;
        return entity;
    }
}
