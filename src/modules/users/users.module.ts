import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UpdateProfileUseCase } from './application/use-cases/update-profile.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { ListDoctorsUseCase } from './application/use-cases/list-doctors.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { UserTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/user.typeorm-entity';
import { UserDetailsTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/user-details.typeorm-entity';
import { UserTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/user.typeorm-repository';
import { IUSER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { UsersController } from './infrastructure/controllers/users.controller';

@Module({
    imports: [TypeOrmModule.forFeature([UserTypeOrmEntity, UserDetailsTypeOrmEntity])],
    controllers: [UsersController],
    providers: [
        CreateUserUseCase,
        UpdateProfileUseCase,
        ListUsersUseCase,
        ListDoctorsUseCase,
        DeleteUserUseCase,
        {
            provide: IUSER_REPOSITORY,
            useClass: UserTypeOrmRepository,
        },
    ],
    exports: [IUSER_REPOSITORY],
})
export class UsersModule { }
