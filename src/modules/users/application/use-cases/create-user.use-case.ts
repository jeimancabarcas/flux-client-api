import { Inject, Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { UserDetails } from '../../domain/entities/user-details.entity';
import { IUSER_REPOSITORY, type IUserRepository } from '../../domain/repositories/user.repository.interface';
import { ISPECIALTY_REPOSITORY, type ISpecialtyRepository } from '../../domain/repositories/specialty.repository.interface';
import { CreateUserDto } from '../../infrastructure/dtos/create-user.dto';
import { UserRole } from '../../../../common/enums/user-role.enum';

@Injectable()
export class CreateUserUseCase {
    constructor(
        @Inject(IUSER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(ISPECIALTY_REPOSITORY)
        private readonly specialtyRepository: ISpecialtyRepository,
    ) { }

    async execute(dto: CreateUserDto): Promise<User> {
        // Check if email exists (including soft-deleted)
        const existingUserByEmail = await this.userRepository.findByEmail(dto.email, true);
        if (existingUserByEmail) {
            const status = existingUserByEmail.deletedAt ? 'ELIMINADO (en papelera)' : 'ACTIVO';
            throw new ConflictException(`El email ${dto.email} ya existe en el sistema con estado: ${status}.`);
        }

        // Check if cedula exists (including soft-deleted)
        if (dto.cedula) {
            const existingUserByCedula = await this.userRepository.findByCedula(dto.cedula, true);
            if (existingUserByCedula) {
                const status = existingUserByCedula.deletedAt ? 'ELIMINADO (en papelera)' : 'ACTIVO';
                throw new ConflictException(`La cédula ${dto.cedula} ya existe vinculada a un usuario con estado: ${status}.`);
            }
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Create details if any field is provided
        let details: UserDetails | null = null;
        if (this.hasAnyDetail(dto)) {
            details = new UserDetails(
                null,
                dto.cedula ?? null,
                dto.nombre ?? null,
                dto.apellido ?? null,
                dto.direccionPrincipal ?? null,
                dto.direccionSecundaria ?? null,
                dto.telefono ?? null,
            );
        }

        // Fetch specialties if provided
        let specialties: any[] = [];
        if (dto.specialtyIds && dto.specialtyIds.length > 0) {
            if (dto.role !== UserRole.MEDICO) {
                throw new ConflictException('Solo se pueden asignar especialidades a usuarios con rol MEDICO');
            }

            specialties = await this.specialtyRepository.findManyByIds(dto.specialtyIds);
            if (specialties.length !== dto.specialtyIds.length) {
                throw new NotFoundException('Una o más especialidades no existen');
            }
        }

        const user = new User(
            null,
            dto.email,
            hashedPassword,
            dto.role,
            details,
            specialties,
        );

        return this.userRepository.create(user);
    }

    private hasAnyDetail(dto: CreateUserDto): boolean {
        return !!(
            dto.cedula ||
            dto.nombre ||
            dto.apellido ||
            dto.direccionPrincipal ||
            dto.direccionSecundaria ||
            dto.telefono
        );
    }
}
