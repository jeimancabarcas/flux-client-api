import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductServiceRepository } from '../../../../domain/repositories/product-service.repository.interface';
import { ProductService } from '../../../../domain/entities/product-service.entity';
import { ProductServiceTypeOrmEntity } from '../entities/product-service.typeorm-entity';
import { ProductServiceMapper } from '../mappers/product-service.mapper';

@Injectable()
export class TypeOrmProductServiceRepository implements IProductServiceRepository {
    constructor(
        @InjectRepository(ProductServiceTypeOrmEntity)
        private readonly repository: Repository<ProductServiceTypeOrmEntity>,
    ) { }

    async save(productService: ProductService): Promise<ProductService> {
        const entity = ProductServiceMapper.toPersistence(productService);
        const saved = await this.repository.save(entity);
        return ProductServiceMapper.toDomain(saved);
    }

    async findById(id: string): Promise<ProductService | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? ProductServiceMapper.toDomain(entity) : null;
    }

    async findAll(): Promise<ProductService[]> {
        const entities = await this.repository.find({ order: { name: 'ASC' } });
        return entities.map(ProductServiceMapper.toDomain);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
