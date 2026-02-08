import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class AssignSpecialtiesDto {
    @ApiProperty({ example: ['uuid-1', 'uuid-2'], description: 'Lista de IDs de especialidades' })
    @IsArray()
    @IsUUID('all', { each: true })
    specialtyIds: string[];
}
