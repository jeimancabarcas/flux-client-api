import { ProductServiceType } from './product-service-type.enum';

export class ProductService {
    constructor(
        public readonly id: string | null,
        public code: string,
        public name: string,
        public type: ProductServiceType,
        public price: number,
        public isActive: boolean = true,
        public stock: number | null = null,
    ) { }
}
