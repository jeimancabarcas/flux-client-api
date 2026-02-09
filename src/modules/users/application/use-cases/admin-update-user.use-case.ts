import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { UserDetails } from '../../domain/entities/user-details.entity';
import { IUSER_REPOSITORY, type IUserRepository } from '../../domain/repositories/user.repository.interface';
import { ISPECIALTY_REPOSITORY, type ISpecialtyRepository } from '../../domain/repositories/specialty.repository.interface';
import { AdminUpdateUserDto } from '../../infrastructure/dtos/admin-update-user.dto';
import { UserRole } from '../../../../common/enums/user-role.enum';

@Injectable()
export class AdminUpdateUserUseCase {
    constructor(
        @Inject(IUSER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(ISPECIALTY_REPOSITORY)
        private readonly specialtyRepository: ISpecialtyRepository,
    ) { }

    async execute(userId: string, dto: AdminUpdateUserDto): Promise<User> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // 1. Update Email if provided
        if (dto.email && dto.email !== user.email) {
            const existingUser = await this.userRepository.findByEmail(dto.email);
            if (existingUser) {
                throw new ConflictException('El correo electrónico ya está en uso');
            }
            user.email = dto.email;
        }

        // 2. Update Password if provided
        if (dto.password) {
            user.password = await bcrypt.hash(dto.password, 10);
        }

        // 3. Update Role if provided
        if (dto.role) {
            user.role = dto.role;
        }

        // 4. Update Personal Details
        if (dto.cedula || dto.nombre || dto.apellido || dto.direccionPrincipal || dto.direccionSecundaria || dto.telefono) {
            if (dto.cedula) {
                const existingWithCedula = await this.userRepository.findByCedula(dto.cedula, true);
                if (existingWithCedula && existingWithCedula.id !== userId) {
                    throw new ConflictException(`La cédula ${dto.cedula} ya está registrada por otro usuario.`);
                }
            }

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
        }

        // 5. Update Specialties if provided
        if (dto.specialtyIds) {
            // Usually we only assign specialties to doctors, but we'll allow it if the user is a doctor or is being promoted to one
            if (user.role !== UserRole.MEDICO) {
                throw new ConflictException('Solo se pueden asignar especialidades a usuarios con rol MEDICO');
            }

            const specialties = await this.specialtyRepository.findManyByIds(dto.specialtyIds);
            if (specialties.length !== dto.specialtyIds.length) {
                throw new NotFoundException('Una o más especialidades no existen');
            }
            user.specialties = specialties;
        }

        return this.userRepository.update(userId, user);
    }
}
