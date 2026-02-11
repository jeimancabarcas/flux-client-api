import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ScheduleAppointmentUseCase } from '../../application/use-cases/schedule-appointment.use-case';
import { StartAppointmentUseCase } from '../../application/use-cases/start-appointment.use-case';
import { CompleteAppointmentUseCase } from '../../application/use-cases/complete-appointment.use-case';
import { CancelAppointmentUseCase } from '../../application/use-cases/cancel-appointment.use-case';
import { ConfirmAppointmentUseCase } from '../../application/use-cases/confirm-appointment.use-case';
import { ListAppointmentsUseCase } from '../../application/use-cases/list-appointments.use-case';
import { GetDoctorNextAppointmentsUseCase } from '../../application/use-cases/get-doctor-next-appointments.use-case';
import { GetAppointmentUseCase } from '../../application/use-cases/get-appointment.use-case';
import { GetActiveConsultationUseCase } from '../../application/use-cases/get-active-consultation.use-case';
import { RescheduleAppointmentUseCase } from '../../application/use-cases/reschedule-appointment.use-case';
import { DeleteAppointmentUseCase } from '../../application/use-cases/delete-appointment.use-case';
import { ListPatientAppointmentsUseCase } from '../../application/use-cases/list-patient-appointments.use-case';
import { GetPatientNextAppointmentUseCase } from '../../application/use-cases/get-patient-next-appointment.use-case';
import { CreateAppointmentDto } from '../dtos/create-appointment.dto';
import { CompleteAppointmentDto } from '../dtos/complete-appointment.dto';
import { CancelAppointmentDto } from '../dtos/cancel-appointment.dto';
import { RescheduleAppointmentDto } from '../dtos/reschedule-appointment.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums/user-role.enum';
import { AppointmentStatus } from '../../domain/entities/appointment-status.enum';
import { AppointmentMapper } from '../persistence/typeorm/mappers/appointment.mapper';

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
        private readonly confirmAppointmentUseCase: ConfirmAppointmentUseCase,
        private readonly listAppointmentsUseCase: ListAppointmentsUseCase,
        private readonly getDoctorNextAppointmentsUseCase: GetDoctorNextAppointmentsUseCase,
        private readonly getAppointmentUseCase: GetAppointmentUseCase,
        private readonly getActiveConsultationUseCase: GetActiveConsultationUseCase,
        private readonly rescheduleAppointmentUseCase: RescheduleAppointmentUseCase,
        private readonly deleteAppointmentUseCase: DeleteAppointmentUseCase,
        private readonly listPatientAppointmentsUseCase: ListPatientAppointmentsUseCase,
        private readonly getPatientNextAppointmentUseCase: GetPatientNextAppointmentUseCase,
    ) { }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.MEDICO)
    @ApiOperation({ summary: 'Agendar una nueva cita' })
    async create(@Body() dto: CreateAppointmentDto, @Request() req: any) {
        const appointment = await this.scheduleAppointmentUseCase.execute({
            ...dto,
            startTime: new Date(dto.startTime),
        }, req.user);
        return AppointmentMapper.toResponse(appointment);
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
        const appointments = await this.listAppointmentsUseCase.execute(req.user, {
            patientId,
            doctorId,
            status,
            start: start ? new Date(start) : undefined,
            end: end ? new Date(end) : undefined,
        });
        return appointments.map(AppointmentMapper.toResponse);
    }

    @Get('next')
    @Roles(UserRole.MEDICO)
    @ApiOperation({ summary: 'Obtener las siguientes citas del día para el médico autenticado' })
    async getNext(
        @Request() req: any,
        @Query('date') date?: string,
        @Query('order') order: 'ASC' | 'DESC' = 'DESC'
    ) {
        const clientDate = date ? new Date(date) : undefined;
        const appointments = await this.getDoctorNextAppointmentsUseCase.execute(req.user.id, clientDate, order);
        return appointments.map(AppointmentMapper.toResponse);
    }

    @Get('active-consultation')
    @Roles(UserRole.MEDICO)
    @ApiOperation({ summary: 'Obtener la consulta que el médico tiene actualmente en curso' })
    async getActiveConsultation(@Request() req: any) {
        const appointment = await this.getActiveConsultationUseCase.execute(req.user.id);
        return appointment ? AppointmentMapper.toResponse(appointment) : null;
    }

    @Get('patient/:id')
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.MEDICO)
    @ApiOperation({ summary: 'Listar historial de citas de un paciente' })
    async getByPatient(
        @Param('id') id: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        const result = await this.listPatientAppointmentsUseCase.execute(
            id,
            Number(page) || 1,
            Number(limit) || 10,
        );
        return {
            data: result.data.map(AppointmentMapper.toResponse),
            total: result.total,
        };
    }

    @Get('patient/:id/next')
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.MEDICO)
    @ApiOperation({ summary: 'Obtener la siguiente cita pendiente/confirmada de un paciente' })
    async getNextByPatient(
        @Param('id') id: string,
        @Query('date') date?: string
    ) {
        const referenceDate = date ? new Date(date) : undefined;
        const appointment = await this.getPatientNextAppointmentUseCase.execute(id, referenceDate);
        return appointment ? AppointmentMapper.toResponse(appointment) : null;
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.MEDICO)
    @ApiOperation({ summary: 'Obtener detalles de una cita específica' })
    async findOne(@Param('id') id: string, @Request() req: any) {
        const appointment = await this.getAppointmentUseCase.execute(id, req.user);
        return AppointmentMapper.toResponse(appointment);
    }

    @Patch(':id/start')
    @Roles(UserRole.ADMIN, UserRole.MEDICO)
    @ApiOperation({ summary: 'Iniciar consulta (Médico)' })
    async start(@Param('id') id: string, @Request() req: any) {
        const appointment = await this.startAppointmentUseCase.execute(id, req.user);
        return AppointmentMapper.toResponse(appointment);
    }

    @Patch(':id/confirm')
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
    @ApiOperation({ summary: 'Confirmar llegada/asistencia (Admin/Rec)' })
    async confirm(@Param('id') id: string, @Request() req: any) {
        const appointment = await this.confirmAppointmentUseCase.execute(id, req.user.role);
        return AppointmentMapper.toResponse(appointment);
    }

    @Patch(':id/complete')
    @Roles(UserRole.ADMIN, UserRole.MEDICO)
    @ApiOperation({ summary: 'Completar consulta (Médico)' })
    async complete(
        @Param('id') id: string,
        @Body() dto: CompleteAppointmentDto,
        @Request() req: any,
    ) {
        const appointment = await this.completeAppointmentUseCase.execute(id, req.user, dto.notes);
        return AppointmentMapper.toResponse(appointment);
    }

    @Patch(':id/cancel')
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.MEDICO)
    @ApiOperation({ summary: 'Cancelar cita (Cualquier rol permitido)' })
    async cancel(
        @Param('id') id: string,
        @Body() dto: CancelAppointmentDto,
        @Request() req: any,
    ) {
        const appointment = await this.cancelAppointmentUseCase.execute(id, req.user, dto.reason);
        return AppointmentMapper.toResponse(appointment);
    }

    @Patch(':id/reschedule')
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
    @ApiOperation({ summary: 'Reprogramar cita (Admin/Rec)' })
    async reschedule(
        @Param('id') id: string,
        @Body() dto: RescheduleAppointmentDto,
        @Request() req: any,
    ) {
        const appointment = await this.rescheduleAppointmentUseCase.execute(
            id,
            new Date(dto.startTime),
            dto.durationMinutes,
            req.user,
        );
        return AppointmentMapper.toResponse(appointment);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
    @ApiOperation({ summary: 'Eliminar una cita cancelada del calendario (Admin/Rec)' })
    async remove(@Param('id') id: string, @Request() req: any) {
        return this.deleteAppointmentUseCase.execute(id, req.user);
    }
}
