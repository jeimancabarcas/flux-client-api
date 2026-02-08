import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { IUSER_REPOSITORY, type IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserRole } from '../../../../common/enums/user-role.enum';

@Injectable()
export class ListDoctorsUseCase {
    constructor(
        @Inject(IUSER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(): Promise<User[]> {
        return this.userRepository.findByRole(UserRole.MEDICO);
    }
}
