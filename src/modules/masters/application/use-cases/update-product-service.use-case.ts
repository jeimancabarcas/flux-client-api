import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPRODUCT_SERVICE_REPOSITORY, type IProductServiceRepository } from '../../domain/repositories/product-service.repository.interface';
import { ProductService } from '../../domain/entities/product-service.entity';
import { UpdateProductServiceDto } from '../../infrastructure/dtos/update-product-service.dto';

@Injectable()
export class UpdateProductServiceUseCase {
    constructor(
        @Inject(IPRODUCT_SERVICE_REPOSITORY)
        private readonly repository: IProductServiceRepository,
    ) { }

    async execute(id: string, dto: UpdateProductServiceDto): Promise<ProductService> {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('Producto o servicio no encontrado');

        const updated = new ProductService(
            existing.id,
            dto.code ?? existing.code,
            dto.name ?? existing.name,
            dto.type ?? existing.type,
            dto.price ?? existing.price,
            dto.isActive ?? existing.isActive,
            dto.stock !== undefined ? dto.stock : existing.stock,
        );
        return this.repository.save(updated);
    }
}
