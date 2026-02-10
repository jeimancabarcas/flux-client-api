import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ProductServiceType } from '../../../../domain/entities/product-service-type.enum';

@Entity({ name: 'products_services', schema: 'fluxmedical' })
export class ProductServiceTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string;

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: ProductServiceType,
    })
    type: ProductServiceType;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ type: 'int', nullable: true })
    stock: number | null;
}
