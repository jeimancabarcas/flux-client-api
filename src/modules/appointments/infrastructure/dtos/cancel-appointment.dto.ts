import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CancelAppointmentDto {
    @ApiPropertyOptional({ example: 'Paciente no asistió.' })
    @IsString()
    @IsOptional()
    reason?: string;
}
