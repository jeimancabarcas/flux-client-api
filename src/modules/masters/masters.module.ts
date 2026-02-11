import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpsTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/eps.typeorm-entity';
import { PrepagadaTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/prepagada.typeorm-entity';
import { ProductServiceTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/product-service.typeorm-entity';
import { EpsController } from './infrastructure/controllers/eps.controller';
import { PrepagadaController } from './infrastructure/controllers/prepagada.controller';
import { ProductServiceController } from './infrastructure/controllers/product-service.controller';
import { AgreementsController } from './infrastructure/controllers/agreements.controller';
import { CreateEpsUseCase } from './application/use-cases/create-eps.use-case';
import { ListEpsUseCase } from './application/use-cases/list-eps.use-case';
import { UpdateEpsUseCase } from './application/use-cases/update-eps.use-case';
import { DeleteEpsUseCase } from './application/use-cases/delete-eps.use-case';
import { CreatePrepagadaUseCase } from './application/use-cases/create-prepagada.use-case';
import { ListPrepagadaUseCase } from './application/use-cases/list-prepagada.use-case';
import { UpdatePrepagadaUseCase } from './application/use-cases/update-prepagada.use-case';
import { DeletePrepagadaUseCase } from './application/use-cases/delete-prepagada.use-case';
import { CreateProductServiceUseCase } from './application/use-cases/create-product-service.use-case';
import { ListProductServicesUseCase } from './application/use-cases/list-product-services.use-case';
import { UpdateProductServiceUseCase } from './application/use-cases/update-product-service.use-case';
import { DeleteProductServiceUseCase } from './application/use-cases/delete-product-service.use-case';
import { CreateAgreementUseCase } from './application/use-cases/create-agreement.use-case';
import { ListAgreementsUseCase } from './application/use-cases/list-agreements.use-case';
import { UpdateAgreementUseCase } from './application/use-cases/update-agreement.use-case';
import { DeleteAgreementUseCase } from './application/use-cases/delete-agreement.use-case';
import { IEPS_REPOSITORY } from './domain/repositories/eps.repository.interface';
import { IPREPAGADA_REPOSITORY } from './domain/repositories/prepagada.repository.interface';
import { TypeOrmEpsRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-eps.repository';
import { TypeOrmPrepagadaRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-prepagada.repository';
import { IPRODUCT_SERVICE_REPOSITORY } from './domain/repositories/product-service.repository.interface';
import { TypeOrmProductServiceRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-product-service.repository';
import { AgreementTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/agreement.typeorm-entity';
import { IAGREEMENT_REPOSITORY } from './domain/repositories/agreement.repository.interface';
import { TypeOrmAgreementRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-agreement.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EpsTypeOrmEntity,
            PrepagadaTypeOrmEntity,
            ProductServiceTypeOrmEntity,
            AgreementTypeOrmEntity
        ]),
    ],
    controllers: [EpsController, PrepagadaController, ProductServiceController, AgreementsController],
    providers: [
        CreateEpsUseCase,
        ListEpsUseCase,
        UpdateEpsUseCase,
        DeleteEpsUseCase,
        CreatePrepagadaUseCase,
        ListPrepagadaUseCase,
        UpdatePrepagadaUseCase,
        DeletePrepagadaUseCase,
        CreateProductServiceUseCase,
        ListProductServicesUseCase,
        UpdateProductServiceUseCase,
        DeleteProductServiceUseCase,
        CreateAgreementUseCase,
        ListAgreementsUseCase,
        UpdateAgreementUseCase,
        DeleteAgreementUseCase,
        {
            provide: IEPS_REPOSITORY,
            useClass: TypeOrmEpsRepository,
        },
        {
            provide: IPREPAGADA_REPOSITORY,
            useClass: TypeOrmPrepagadaRepository,
        },
        {
            provide: IPRODUCT_SERVICE_REPOSITORY,
            useClass: TypeOrmProductServiceRepository,
        },
        {
            provide: IAGREEMENT_REPOSITORY,
            useClass: TypeOrmAgreementRepository,
        },
    ],
    exports: [IEPS_REPOSITORY, IPREPAGADA_REPOSITORY, IPRODUCT_SERVICE_REPOSITORY, IAGREEMENT_REPOSITORY],
})
export class MastersModule { }
