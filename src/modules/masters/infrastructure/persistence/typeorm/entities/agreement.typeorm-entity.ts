import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductServiceTypeOrmEntity } from './product-service.typeorm-entity';
import { PrepagadaTypeOrmEntity } from './prepagada.typeorm-entity';

@Entity('agreements', { schema: 'fluxmedical' })
export class AgreementTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'product_service_id' })
    productServiceId: string;

    @Column({ type: 'uuid', name: 'prepagada_id' })
    prepagadaId: string;

    @Column('decimal', { name: 'patient_amount', precision: 12, scale: 2 })
    patientAmount: number;

    @Column('decimal', { name: 'entity_amount', precision: 12, scale: 2 })
    entityAmount: number;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => ProductServiceTypeOrmEntity)
    @JoinColumn({ name: 'product_service_id' })
    productService: ProductServiceTypeOrmEntity;

    @ManyToOne(() => PrepagadaTypeOrmEntity)
    @JoinColumn({ name: 'prepagada_id' })
    prepagada: PrepagadaTypeOrmEntity;
}
