import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUSER_REPOSITORY, type IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class DeleteUserUseCase {
    constructor(
        @Inject(IUSER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(userId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        await this.userRepository.softDelete(userId);
    }
}
