import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CumTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/cum.typeorm-entity';
import { ICUMS_REPOSITORY } from './domain/repositories/cums.repository.interface';
import { TypeOrmCumsRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-cum.repository';
import { ImportCumsUseCase } from './application/use-cases/import-cums.use-case';
import { SearchCumsUseCase } from './application/use-cases/search-cums.use-case';
import { CumsController } from './infrastructure/controllers/cums.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([CumTypeOrmEntity]),
    ],
    controllers: [CumsController],
    providers: [
        ImportCumsUseCase,
        SearchCumsUseCase,
        {
            provide: ICUMS_REPOSITORY,
            useClass: TypeOrmCumsRepository,
        },
    ],
    exports: [ICUMS_REPOSITORY],
})
export class CumsModule { }
