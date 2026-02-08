import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
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
}
