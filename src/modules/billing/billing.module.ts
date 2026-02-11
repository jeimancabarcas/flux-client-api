import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/invoice.typeorm-entity';
import { InvoiceItemTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/invoice-item.typeorm-entity';
import { IINVOICE_REPOSITORY } from './domain/repositories/invoice.repository.interface';
import { TypeOrmInvoiceRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-invoice.repository';

import { BillingController } from './infrastructure/controllers/billing.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            InvoiceTypeOrmEntity,
            InvoiceItemTypeOrmEntity,
        ]),
    ],
    providers: [
        {
            provide: IINVOICE_REPOSITORY,
            useClass: TypeOrmInvoiceRepository,
        },
    ],
    controllers: [BillingController],
    exports: [IINVOICE_REPOSITORY],
})
export class BillingModule { }
