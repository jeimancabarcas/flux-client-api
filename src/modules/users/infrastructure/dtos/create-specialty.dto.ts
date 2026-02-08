import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSpecialtyDto {
    @ApiProperty({ example: 'Cardiología' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ example: 'Especialidad médica que se ocupa de las afecciones del corazón y del aparato circulatorio.' })
    @IsString()
    @IsOptional()
    description?: string;
}
