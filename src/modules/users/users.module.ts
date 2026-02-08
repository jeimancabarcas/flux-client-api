import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UpdateProfileUseCase } from './application/use-cases/update-profile.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { ListDoctorsUseCase } from './application/use-cases/list-doctors.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { CreateSpecialtyUseCase } from './application/use-cases/create-specialty.use-case';
import { ListSpecialtiesUseCase } from './application/use-cases/list-specialties.use-case';
import { AssignSpecialtiesToDoctorUseCase } from './application/use-cases/assign-specialties-to-doctor.use-case';
import { UserTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/user.typeorm-entity';
import { UserDetailsTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/user-details.typeorm-entity';
import { SpecialtyTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/specialty.typeorm-entity';
import { UserTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/user.typeorm-repository';
import { TypeOrmSpecialtyRepository } from './infrastructure/persistence/typeorm/repositories/specialty.typeorm-repository';
import { IUSER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { ISPECIALTY_REPOSITORY } from './domain/repositories/specialty.repository.interface';
import { UsersController } from './infrastructure/controllers/users.controller';
import { SpecialtiesController } from './infrastructure/controllers/specialties.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserTypeOrmEntity,
            UserDetailsTypeOrmEntity,
            SpecialtyTypeOrmEntity,
        ]),
    ],
    controllers: [UsersController, SpecialtiesController],
    providers: [
        CreateUserUseCase,
        UpdateProfileUseCase,
        ListUsersUseCase,
        ListDoctorsUseCase,
        DeleteUserUseCase,
        CreateSpecialtyUseCase,
        ListSpecialtiesUseCase,
        AssignSpecialtiesToDoctorUseCase,
        {
            provide: IUSER_REPOSITORY,
            useClass: UserTypeOrmRepository,
        },
        {
            provide: ISPECIALTY_REPOSITORY,
            useClass: TypeOrmSpecialtyRepository,
        },
    ],
    exports: [IUSER_REPOSITORY, ISPECIALTY_REPOSITORY],
})
export class UsersModule { }
