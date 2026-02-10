import { Inject, Injectable } from '@nestjs/common';
import { IPRODUCT_SERVICE_REPOSITORY, type IProductServiceRepository } from '../../domain/repositories/product-service.repository.interface';
import { ProductService } from '../../domain/entities/product-service.entity';

@Injectable()
export class ListProductServicesUseCase {
    constructor(
        @Inject(IPRODUCT_SERVICE_REPOSITORY)
        private readonly repository: IProductServiceRepository,
    ) { }

    async execute(): Promise<ProductService[]> {
        return this.repository.findAll();
    }
}
