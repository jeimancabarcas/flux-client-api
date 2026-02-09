import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsInt, IsString, IsUUID, IsEnum } from 'class-validator';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';

export class CreateAppointmentDto {
    @ApiProperty({ example: 'uuid-del-paciente' })
    @IsUUID()
    @IsNotEmpty()
    patientId: string;

    @ApiProperty({ example: 'uuid-del-medico' })
    @IsUUID()
    @IsNotEmpty()
    doctorId: string;

    @ApiProperty({ example: '2026-02-10T09:00:00Z', description: 'Fecha y hora de inicio' })
    @IsDateString()
    @IsNotEmpty()
    startTime: string;

    @ApiPropertyOptional({ example: 30, description: 'Duración en minutos (opcional)' })
    @IsInt()
    @IsOptional()
    durationMinutes?: number;

    @ApiPropertyOptional({ example: 'Control mensual', description: 'Motivo de la cita' })
    @IsString()
    @IsOptional()
    reason?: string;

    @ApiPropertyOptional({
        enum: AppointmentStatus,
        example: AppointmentStatus.PENDIENTE,
        description: 'Estado inicial de la cita (opcional, por defecto PENDIENTE)'
    })
    @IsEnum(AppointmentStatus)
    @IsOptional()
    status?: AppointmentStatus;
}
