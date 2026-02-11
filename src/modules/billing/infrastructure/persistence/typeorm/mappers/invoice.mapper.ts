import { Invoice } from '../../../../domain/entities/invoice.entity';
import { InvoiceItem } from '../../../../domain/entities/invoice-item.entity';
import { InvoiceTypeOrmEntity } from '../entities/invoice.typeorm-entity';
import { InvoiceItemTypeOrmEntity } from '../entities/invoice-item.typeorm-entity';

export class InvoiceMapper {
    static toDomain(entity: InvoiceTypeOrmEntity): Invoice {
        const items = entity.items
            ? entity.items.map(itemEntity => new InvoiceItem(
                itemEntity.id,
                itemEntity.invoiceId,
                itemEntity.productServiceId,
                itemEntity.description,
                itemEntity.quantity,
                Number(itemEntity.unitPrice),
                Number(itemEntity.patientAmount),
                itemEntity.patientStatus,
                Number(itemEntity.entityAmount),
                itemEntity.entityStatus,
                Number(itemEntity.totalAmount),
                itemEntity.convenioId,
            ))
            : [];

        return new Invoice(
            entity.id,
            entity.appointmentId,
            entity.patientId,
            entity.invoiceNumber,
            Number(entity.totalAmount),
            entity.status,
            items,
            entity.createdAt,
            entity.updatedAt,
        );
    }

    static toPersistence(domain: Invoice): InvoiceTypeOrmEntity {
        const entity = new InvoiceTypeOrmEntity();
        if (domain.id) entity.id = domain.id;
        entity.appointmentId = domain.appointmentId;
        entity.patientId = domain.patientId;
        entity.invoiceNumber = domain.invoiceNumber!;
        entity.totalAmount = domain.totalAmount;
        entity.status = domain.status;

        if (domain.items) {
            entity.items = domain.items.map(item => {
                const itemEntity = new InvoiceItemTypeOrmEntity();
                if (item.id) itemEntity.id = item.id;
                itemEntity.productServiceId = item.productServiceId;
                itemEntity.description = item.description;
                itemEntity.quantity = item.quantity;
                itemEntity.unitPrice = item.unitPrice;
                itemEntity.patientAmount = item.patientAmount;
                itemEntity.patientStatus = item.patientStatus;
                itemEntity.entityAmount = item.entityAmount;
                itemEntity.entityStatus = item.entityStatus;
                itemEntity.totalAmount = item.totalAmount;
                itemEntity.convenioId = item.convenioId!;
                return itemEntity;
            });
        }

        return entity;
    }
}
