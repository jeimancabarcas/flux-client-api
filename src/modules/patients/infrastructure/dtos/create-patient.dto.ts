import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class CreatePatientDto {
    @ApiProperty({ example: 'Juan Gabriel' })
    @IsString()
    @IsNotEmpty()
    nombres: string;

    @ApiProperty({ example: 'Vásquez Gómez' })
    @IsString()
    @IsNotEmpty()
    apellidos: string;

    @ApiProperty({ example: 'CC', description: 'Tipo de identificación: CC, TI, CE, etc.' })
    @IsString()
    @IsNotEmpty()
    tipoIdentificacion: string;

    @ApiProperty({ example: '1098765432' })
    @IsString()
    @IsNotEmpty()
    numeroIdentificacion: string;

    @ApiProperty({ example: '1990-05-15' })
    @IsDateString()
    @IsNotEmpty()
    fechaNacimiento: string;

    @ApiProperty({ example: 'Masculino' })
    @IsString()
    @IsNotEmpty()
    genero: string;

    @ApiProperty({ example: 'juan@email.com', required: false })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: '3001234567' })
    @IsString()
    @IsNotEmpty()
    telefono: string;

    @ApiProperty({ example: 'Carrera 10 #20-30', required: false })
    @IsString()
    @IsOptional()
    direccion?: string;

    @ApiProperty({ example: true })
    @IsBoolean()
    @IsNotEmpty()
    habeasDataConsent: boolean;
}
