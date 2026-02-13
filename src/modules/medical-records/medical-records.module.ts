import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecordTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/medical-record.typeorm-entity';
import { PediatricExtensionTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/pediatric-extension.typeorm-entity';
import { PatientBackgroundTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/patient-background.typeorm-entity';
import { PhysicalExaminationTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/physical-examination.typeorm-entity';
import { MedicalRecordsController } from './infrastructure/controllers/medical-records.controller';
import { CreateMedicalRecordUseCase } from './application/use-cases/create-medical-record.use-case';
import { IMEDICAL_RECORD_REPOSITORY } from './domain/repositories/medical-record.repository.interface';
import { TypeOrmMedicalRecordRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-medical-record.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MedicalRecordTypeOrmEntity,
            PediatricExtensionTypeOrmEntity,
            PatientBackgroundTypeOrmEntity,
            PhysicalExaminationTypeOrmEntity,
        ]),
    ],
    controllers: [MedicalRecordsController],
    providers: [
        {
            provide: IMEDICAL_RECORD_REPOSITORY,
            useClass: TypeOrmMedicalRecordRepository,
        },
        CreateMedicalRecordUseCase,
    ],
    exports: [IMEDICAL_RECORD_REPOSITORY],
})
export class MedicalRecordsModule { }
