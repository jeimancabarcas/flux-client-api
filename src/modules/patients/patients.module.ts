import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/patient.typeorm-entity';
import { PatientsController } from './infrastructure/controllers/patients.controller';
import { RegisterPatientUseCase } from './application/use-cases/register-patient.use-case';
import { GetPatientSummaryUseCase } from './application/use-cases/get-patient-summary.use-case';
import { SearchPatientUseCase } from './application/use-cases/search-patient.use-case';
import { ListPatientsUseCase } from './application/use-cases/list-patients.use-case';
import { IPATIENT_REPOSITORY } from './domain/repositories/patient.repository.interface';
import { TypeOrmPatientRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-patient.repository';

@Module({
    imports: [TypeOrmModule.forFeature([PatientTypeOrmEntity])],
    controllers: [PatientsController],
    providers: [
        RegisterPatientUseCase,
        GetPatientSummaryUseCase,
        SearchPatientUseCase,
        ListPatientsUseCase,
        {
            provide: IPATIENT_REPOSITORY,
            useClass: TypeOrmPatientRepository,
        },
    ],
    exports: [IPATIENT_REPOSITORY],
})
export class PatientsModule { }
