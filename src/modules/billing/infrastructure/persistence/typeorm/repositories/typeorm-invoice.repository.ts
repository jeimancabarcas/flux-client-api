import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IInvoiceRepository } from '../../../../domain/repositories/invoice.repository.interface';
import { Invoice } from '../../../../domain/entities/invoice.entity';
import { InvoiceTypeOrmEntity } from '../entities/invoice.typeorm-entity';
import { InvoiceMapper } from '../mappers/invoice.mapper';

@Injectable()
export class TypeOrmInvoiceRepository implements IInvoiceRepository {
    constructor(
        @InjectRepository(InvoiceTypeOrmEntity)
        private readonly repository: Repository<InvoiceTypeOrmEntity>,
    ) { }

    async save(invoice: Invoice): Promise<Invoice> {
        const entity = InvoiceMapper.toPersistence(invoice);
        const saved = await this.repository.save(entity);
        return InvoiceMapper.toDomain(saved);
    }

    async findById(id: string): Promise<Invoice | null> {
        const entity = await this.repository.findOne({
            where: { id },
            relations: ['items', 'patient', 'appointment']
        });
        return entity ? InvoiceMapper.toDomain(entity) : null;
    }

    async findByAppointmentId(appointmentId: string): Promise<Invoice | null> {
        const entity = await this.repository.findOne({
            where: { appointmentId },
            relations: ['items']
        });
        return entity ? InvoiceMapper.toDomain(entity) : null;
    }

    async findByPatientId(patientId: string): Promise<Invoice[]> {
        const entities = await this.repository.find({
            where: { patientId },
            relations: ['items'],
            order: { createdAt: 'DESC' }
        });
        return entities.map(InvoiceMapper.toDomain);
    }
}
