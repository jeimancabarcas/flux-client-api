import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ScheduleAppointmentUseCase } from '../../application/use-cases/schedule-appointment.use-case';
import { StartAppointmentUseCase } from '../../application/use-cases/start-appointment.use-case';
import { CompleteAppointmentUseCase } from '../../application/use-cases/complete-appointment.use-case';
import { CancelAppointmentUseCase } from '../../application/use-cases/cancel-appointment.use-case';
import { ListAppointmentsUseCase } from '../../application/use-cases/list-appointments.use-case';
import { CreateAppointmentDto } from '../dtos/create-appointment.dto';
import { CompleteAppointmentDto } from '../dtos/complete-appointment.dto';
import { CancelAppointmentDto } from '../dtos/cancel-appointment.dto';
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
        private readonly startAppointmentUseCase: StartAppointmentUseCase,
        private readonly completeAppointmentUseCase: CompleteAppointmentUseCase,
        private readonly cancelAppointmentUseCase: CancelAppointmentUseCase,
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

    @Patch(':id/start')
    @Roles(UserRole.ADMIN, UserRole.MEDICO)
    @ApiOperation({ summary: 'Iniciar consulta (Médico)' })
    async start(@Param('id') id: string, @Request() req: any) {
        return this.startAppointmentUseCase.execute(id, req.user);
    }

    @Patch(':id/complete')
    @Roles(UserRole.ADMIN, UserRole.MEDICO)
    @ApiOperation({ summary: 'Completar consulta (Médico)' })
    async complete(
        @Param('id') id: string,
        @Body() dto: CompleteAppointmentDto,
        @Request() req: any,
    ) {
        return this.completeAppointmentUseCase.execute(id, req.user, dto.notes);
    }

    @Patch(':id/cancel')
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.MEDICO)
    @ApiOperation({ summary: 'Cancelar cita (Cualquier rol permitido)' })
    async cancel(
        @Param('id') id: string,
        @Body() dto: CancelAppointmentDto,
        @Request() req: any,
    ) {
        return this.cancelAppointmentUseCase.execute(id, req.user, dto.reason);
    }
}
