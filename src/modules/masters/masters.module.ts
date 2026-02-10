import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpsTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/eps.typeorm-entity';
import { PrepagadaTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/prepagada.typeorm-entity';
import { EpsController } from './infrastructure/controllers/eps.controller';
import { PrepagadaController } from './infrastructure/controllers/prepagada.controller';
import { CreateEpsUseCase } from './application/use-cases/create-eps.use-case';
import { ListEpsUseCase } from './application/use-cases/list-eps.use-case';
import { UpdateEpsUseCase } from './application/use-cases/update-eps.use-case';
import { DeleteEpsUseCase } from './application/use-cases/delete-eps.use-case';
import { CreatePrepagadaUseCase } from './application/use-cases/create-prepagada.use-case';
import { ListPrepagadaUseCase } from './application/use-cases/list-prepagada.use-case';
import { UpdatePrepagadaUseCase } from './application/use-cases/update-prepagada.use-case';
import { DeletePrepagadaUseCase } from './application/use-cases/delete-prepagada.use-case';
import { IEPS_REPOSITORY } from './domain/repositories/eps.repository.interface';
import { IPREPAGADA_REPOSITORY } from './domain/repositories/prepagada.repository.interface';
import { TypeOrmEpsRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-eps.repository';
import { TypeOrmPrepagadaRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-prepagada.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([EpsTypeOrmEntity, PrepagadaTypeOrmEntity]),
    ],
    controllers: [EpsController, PrepagadaController],
    providers: [
        CreateEpsUseCase,
        ListEpsUseCase,
        UpdateEpsUseCase,
        DeleteEpsUseCase,
        CreatePrepagadaUseCase,
        ListPrepagadaUseCase,
        UpdatePrepagadaUseCase,
        DeletePrepagadaUseCase,
        {
            provide: IEPS_REPOSITORY,
            useClass: TypeOrmEpsRepository,
        },
        {
            provide: IPREPAGADA_REPOSITORY,
            useClass: TypeOrmPrepagadaRepository,
        },
    ],
    exports: [IEPS_REPOSITORY, IPREPAGADA_REPOSITORY],
})
export class MastersModule { }
