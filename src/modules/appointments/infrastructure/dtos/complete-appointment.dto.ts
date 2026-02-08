import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CompleteAppointmentDto {
    @ApiPropertyOptional({ example: 'Paciente estable, se receta reposo.' })
    @IsString()
    @IsOptional()
    notes?: string;
}
