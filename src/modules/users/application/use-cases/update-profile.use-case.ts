import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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

    async execute(userId: string, dto: UpdateProfileDto, requesterRole: string): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if cedula is being updated and if it's already in use by another user
        if (dto.cedula) {
            // Check even in soft-deleted users
            const existingUserWithCedula = await this.userRepository.findByCedula(dto.cedula, true);

            if (existingUserWithCedula && existingUserWithCedula.id !== userId) {
                throw new ConflictException(`La cédula ${dto.cedula} ya está registrada por otro usuario.`);
            }
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
            // Logic for updating existing details
            if (dto.cedula) {
                // Only allow changing cedula if it's empty OR the requester is an ADMIN
                if (!user.details.cedula || requesterRole === 'ADMIN') {
                    user.details.cedula = dto.cedula;
                }
            }

            if (dto.nombre) user.details.nombre = dto.nombre;
            if (dto.apellido) user.details.apellido = dto.apellido;
            if (dto.direccionPrincipal) user.details.direccionPrincipal = dto.direccionPrincipal;
            if (dto.direccionSecundaria) user.details.direccionSecundaria = dto.direccionSecundaria;
            if (dto.telefono) user.details.telefono = dto.telefono;
        }

        return this.userRepository.update(userId, user);
    }
}
