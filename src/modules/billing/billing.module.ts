import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/invoice.typeorm-entity';
import { InvoiceItemTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/invoice-item.typeorm-entity';
import { IINVOICE_REPOSITORY } from './domain/repositories/invoice.repository.interface';
import { TypeOrmInvoiceRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-invoice.repository';

import { BillingController } from './infrastructure/controllers/billing.controller';

import { PatientsModule } from '../patients/patients.module';
import { MastersModule } from '../masters/masters.module';
import { CreateStandaloneInvoiceUseCase } from './application/use-cases/create-standalone-invoice.use-case';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            InvoiceTypeOrmEntity,
            InvoiceItemTypeOrmEntity,
        ]),
        PatientsModule,
        MastersModule,
    ],
    providers: [
        {
            provide: IINVOICE_REPOSITORY,
            useClass: TypeOrmInvoiceRepository,
        },
        CreateStandaloneInvoiceUseCase,
    ],
    controllers: [BillingController],
    exports: [IINVOICE_REPOSITORY],
})
export class BillingModule { }
