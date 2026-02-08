import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../../../common/enums/user-role.enum';

export class CreateUserDto {
    @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ example: 'juan.perez@fluxmedical.com', description: 'Correo electrónico único' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Admin123!', minLength: 6, description: 'Contraseña del usuario' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ enum: UserRole, example: UserRole.MEDICO, description: 'Rol asignado al usuario' })
    @IsEnum(UserRole)
    role: UserRole;
}
