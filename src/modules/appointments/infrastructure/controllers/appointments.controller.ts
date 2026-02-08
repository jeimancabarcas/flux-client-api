import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ScheduleAppointmentUseCase } from '../../application/use-cases/schedule-appointment.use-case';
import { UpdateAppointmentStatusUseCase } from '../../application/use-cases/update-appointment-status.use-case';
import { ListAppointmentsUseCase } from '../../application/use-cases/list-appointments.use-case';
import { CreateAppointmentDto } from '../dtos/create-appointment.dto';
import { UpdateAppointmentStatusDto } from '../dtos/update-appointment-status.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums/user-role.enum';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';

@ApiTags('Appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
    constructor(
        private readonly scheduleAppointmentUseCase: ScheduleAppointmentUseCase,
        private readonly updateAppointmentStatusUseCase: UpdateAppointmentStatusUseCase,
        private readonly listAppointmentsUseCase: ListAppointmentsUseCase,
    ) { }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
    @ApiOperation({ summary: 'Agendar una nueva cita' })
    async create(@Body() dto: CreateAppointmentDto) {
        return this.scheduleAppointmentUseCase.execute({
            ...dto,
            startTime: new Date(dto.startTime),
        });
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.MEDICO)
    @ApiOperation({ summary: 'Listar citas (los médicos solo ven la suya)' })
    async findAll(
        @Request() req: any,
        @Query('patientId') patientId?: string,
        @Query('doctorId') doctorId?: string,
        @Query('status') status?: AppointmentStatus,
        @Query('start') start?: string,
        @Query('end') end?: string,
    ) {
        return this.listAppointmentsUseCase.execute(req.user, {
            patientId,
            doctorId,
            status,
            start: start ? new Date(start) : undefined,
            end: end ? new Date(end) : undefined,
        });
    }

    @Patch(':id/status')
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.MEDICO)
    @ApiOperation({ summary: 'Actualizar estado de una cita' })
    async updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateAppointmentStatusDto,
        @Request() req: any,
    ) {
        return this.updateAppointmentStatusUseCase.execute(id, dto.status, req.user);
    }
}
