import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../../../common/enums/user-role.enum';

export class AdminUpdateUserDto {
    @ApiPropertyOptional({ example: 'juan.perez@fluxmedical.com', description: 'Correo electrónico único' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({ example: 'Admin123!', minLength: 6, description: 'Contraseña del usuario' })
    @IsString()
    @IsOptional()
    @MinLength(6)
    password?: string;

    @ApiPropertyOptional({ enum: UserRole, example: UserRole.MEDICO, description: 'Rol asignado al usuario' })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

    @ApiPropertyOptional({ example: '12345678', description: 'Cédula de identidad' })
    @IsString()
    @IsOptional()
    cedula?: string;

    @ApiPropertyOptional({ example: 'Juan', description: 'Nombre' })
    @IsString()
    @IsOptional()
    nombre?: string;

    @ApiPropertyOptional({ example: 'Pérez', description: 'Apellido' })
    @IsString()
    @IsOptional()
    apellido?: string;

    @ApiPropertyOptional({ example: 'Calle 123 #45-67', description: 'Dirección principal' })
    @IsString()
    @IsOptional()
    direccionPrincipal?: string;

    @ApiPropertyOptional({ example: 'Conjunto Residencial El Bosque', description: 'Dirección secundaria' })
    @IsString()
    @IsOptional()
    direccionSecundaria?: string;

    @ApiPropertyOptional({ example: '+573001234567', description: 'Teléfono de contacto' })
    @IsString()
    @IsOptional()
    telefono?: string;

    @ApiPropertyOptional({ example: ['uuid-1', 'uuid-2'], description: 'Lista de IDs de especialidades' })
    @IsOptional()
    specialtyIds?: string[];
}
