import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class RescheduleAppointmentDto {
    @ApiProperty({ example: '2026-02-15T10:00:00Z', description: 'Nueva fecha y hora de la cita' })
    @IsDateString()
    @IsNotEmpty()
    startTime: string;

    @ApiProperty({ example: 30, description: 'Nueva duración en minutos' })
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    durationMinutes: number;
}
