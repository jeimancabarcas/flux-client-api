import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserDetails } from '../../domain/entities/user-details.entity';
import { IUSER_REPOSITORY, type IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UpdateProfileDto } from '../../infrastructure/dtos/update-profile.dto';

@Injectable()
export class UpdateProfileUseCase {
    constructor(
        @Inject(IUSER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(userId: string, dto: UpdateProfileDto): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Handle personal details
        if (!user.details) {
            user.details = new UserDetails(
                null,
                dto.cedula ?? null,
                dto.nombre ?? null,
                dto.apellido ?? null,
                dto.direccionPrincipal ?? null,
                dto.direccionSecundaria ?? null,
                dto.telefono ?? null,
            );
        } else {
            if (dto.cedula) user.details.cedula = dto.cedula;
            if (dto.nombre) user.details.nombre = dto.nombre;
            if (dto.apellido) user.details.apellido = dto.apellido;
            if (dto.direccionPrincipal) user.details.direccionPrincipal = dto.direccionPrincipal;
            if (dto.direccionSecundaria) user.details.direccionSecundaria = dto.direccionSecundaria;
            if (dto.telefono) user.details.telefono = dto.telefono;
        }

        return this.userRepository.update(userId, user);
    }
}
