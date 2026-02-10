import { ProductService } from '../entities/product-service.entity';

export interface IProductServiceRepository {
    save(productService: ProductService): Promise<ProductService>;
    findById(id: string): Promise<ProductService | null>;
    findAll(): Promise<ProductService[]>;
    delete(id: string): Promise<void>;
}

export const IPRODUCT_SERVICE_REPOSITORY = Symbol('IProductServiceRepository');
