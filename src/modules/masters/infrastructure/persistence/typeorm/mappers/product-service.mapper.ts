import { ProductService } from '../../../../domain/entities/product-service.entity';
import { ProductServiceTypeOrmEntity } from '../entities/product-service.typeorm-entity';

export class ProductServiceMapper {
    static toDomain(entity: ProductServiceTypeOrmEntity): ProductService {
        return new ProductService(
            entity.id,
            entity.code,
            entity.name,
            entity.type,
            Number(entity.price),
            entity.isActive,
            entity.stock,
        );
    }

    static toPersistence(domain: ProductService): ProductServiceTypeOrmEntity {
        const entity = new ProductServiceTypeOrmEntity();
        if (domain.id) entity.id = domain.id;
        entity.code = domain.code;
        entity.name = domain.name;
        entity.type = domain.type;
        entity.price = domain.price;
        entity.isActive = domain.isActive;
        entity.stock = domain.stock;
        return entity;
    }
}
