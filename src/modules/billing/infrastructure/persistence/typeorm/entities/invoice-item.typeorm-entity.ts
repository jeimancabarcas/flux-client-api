import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ResponsibilityStatus } from '../../../../domain/entities/responsibility-status.enum';
import { InvoiceTypeOrmEntity } from './invoice.typeorm-entity';
import { ProductServiceTypeOrmEntity } from '../../../../../masters/infrastructure/persistence/typeorm/entities/product-service.typeorm-entity';

@Entity('invoices_items', { schema: 'fluxmedical' })
export class InvoiceItemTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'invoice_id' })
    invoiceId: string;

    @Column({ type: 'uuid', name: 'product_service_id' })
    productServiceId: string;

    @Column({ type: 'varchar' })
    description: string;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 12, scale: 2 })
    unitPrice: number;

    @Column('decimal', { precision: 12, scale: 2 })
    patientAmount: number;

    @Column({
        type: 'enum',
        enum: ResponsibilityStatus,
        default: ResponsibilityStatus.PENDIENTE
    })
    patientStatus: ResponsibilityStatus;

    @Column('decimal', { precision: 12, scale: 2 })
    entityAmount: number;

    @Column({
        type: 'enum',
        enum: ResponsibilityStatus,
        default: ResponsibilityStatus.PENDIENTE
    })
    entityStatus: ResponsibilityStatus;

    @Column('decimal', { precision: 12, scale: 2 })
    totalAmount: number;

    @Column({ type: 'uuid', name: 'convenio_id', nullable: true })
    convenioId: string;

    @ManyToOne(() => InvoiceTypeOrmEntity, invoice => invoice.items)
    @JoinColumn({ name: 'invoice_id' })
    invoice: InvoiceTypeOrmEntity;

    @ManyToOne(() => ProductServiceTypeOrmEntity)
    @JoinColumn({ name: 'product_service_id' })
    productService: ProductServiceTypeOrmEntity;
}
