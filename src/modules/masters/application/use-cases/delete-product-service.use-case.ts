import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPRODUCT_SERVICE_REPOSITORY, type IProductServiceRepository } from '../../domain/repositories/product-service.repository.interface';

@Injectable()
export class DeleteProductServiceUseCase {
    constructor(
        @Inject(IPRODUCT_SERVICE_REPOSITORY)
        private readonly repository: IProductServiceRepository,
    ) { }

    async execute(id: string): Promise<void> {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('Producto o servicio no encontrado');
        await this.repository.delete(id);
    }
}
