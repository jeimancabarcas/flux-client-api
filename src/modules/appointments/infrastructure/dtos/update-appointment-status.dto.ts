import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';

export class UpdateAppointmentStatusDto {
    @ApiProperty({ enum: AppointmentStatus })
    @IsEnum(AppointmentStatus)
    @IsNotEmpty()
    status: AppointmentStatus;
}
