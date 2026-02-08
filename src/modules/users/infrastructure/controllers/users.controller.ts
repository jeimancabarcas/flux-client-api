import { Controller, Post, Body, Get, UseGuards, Patch, Delete, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { UpdateProfileUseCase } from '../../application/use-cases/update-profile.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { ListDoctorsUseCase } from '../../application/use-cases/list-doctors.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { GetUser } from '../../../../common/decorators/get-user.decorator';
import { UserRole } from '../../../../common/enums/user-role.enum';
import { UserMapper } from '../persistence/typeorm/mappers/user.mapper';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly updateProfileUseCase: UpdateProfileUseCase,
        private readonly listUsersUseCase: ListUsersUseCase,
        private readonly listDoctorsUseCase: ListDoctorsUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Crear un nuevo usuario (Solo ADMIN)' })
    @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
    @ApiResponse({ status: 403, description: 'Prohibido por falta de permisos.' })
    @ApiResponse({ status: 409, description: 'El email ya existe.' })
    async create(@Body() createUserDto: CreateUserDto) {
        const user = await this.createUserUseCase.execute(createUserDto);
        return UserMapper.toResponse(user);
    }

    @Patch('profile')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Completar o actualizar el perfil del usuario autenticado' })
    @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    async updateProfile(
        @GetUser('id') userId: string,
        @GetUser('role') role: string,
        @Body() updateProfileDto: UpdateProfileDto,
    ) {
        const user = await this.updateProfileUseCase.execute(userId, updateProfileDto, role);
        return UserMapper.toResponse(user);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Listar todos los usuarios (Solo ADMIN)' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios recuperada.' })
    async findAll() {
        const users = await this.listUsersUseCase.execute();
        return users.map((user) => UserMapper.toResponse(user));
    }

    @Get('doctors')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
    @ApiOperation({ summary: 'Listar solo los médicos (ADMIN y RECEPCIONISTA)' })
    @ApiResponse({ status: 200, description: 'Lista de médicos recuperada.' })
    async findAllDoctors() {
        const users = await this.listDoctorsUseCase.execute();
        return users.map((user) => UserMapper.toResponse(user));
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Eliminar un usuario (Soft Delete - Solo ADMIN)' })
    @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    async remove(@Param('id') id: string) {
        return this.deleteUserUseCase.execute(id);
    }
}
