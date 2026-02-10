import { Inject, Injectable } from '@nestjs/common';
import { IPRODUCT_SERVICE_REPOSITORY, type IProductServiceRepository } from '../../domain/repositories/product-service.repository.interface';
import { ProductService } from '../../domain/entities/product-service.entity';
import { CreateProductServiceDto } from '../../infrastructure/dtos/create-product-service.dto';

@Injectable()
export class CreateProductServiceUseCase {
    constructor(
        @Inject(IPRODUCT_SERVICE_REPOSITORY)
        private readonly repository: IProductServiceRepository,
    ) { }

    async execute(dto: CreateProductServiceDto): Promise<ProductService> {
        const item = new ProductService(
            null,
            dto.code,
            dto.name,
            dto.type,
            dto.price,
            dto.isActive ?? true,
            dto.stock ?? null,
        );
        return this.repository.save(item);
    }
}
