import { Controller, Post, Body, UseGuards, Request, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums/user-role.enum';
import { CreateMedicalRecordUseCase } from '../../application/use-cases/create-medical-record.use-case';
import { CreateMedicalRecordDto } from '../dtos/create-medical-record.dto';
import { Inject } from '@nestjs/common';
import { IMEDICAL_RECORD_REPOSITORY, type IMedicalRecordRepository } from '../../domain/repositories/medical-record.repository.interface';

@ApiTags('Historia Clínica')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('medical-records')
export class MedicalRecordsController {
    constructor(
        private readonly createMedicalRecordUseCase: CreateMedicalRecordUseCase,
        @Inject(IMEDICAL_RECORD_REPOSITORY)
        private readonly medicalRecordRepository: IMedicalRecordRepository,
    ) { }

    @Post()
    @Roles(UserRole.MEDICO)
    @ApiOperation({ summary: 'Registrar una nueva historia clínica' })
    async create(@Body() dto: CreateMedicalRecordDto, @Request() req: any) {
        return await this.createMedicalRecordUseCase.execute(dto, req.user.id);
    }

    @Get('patient/:id')
    @Roles(UserRole.MEDICO)
    @ApiOperation({ summary: 'Obtener historial clínico de un paciente' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    async getByPatient(
        @Param('id') patientId: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5,
    ) {
        return await this.medicalRecordRepository.findByPatientId(
            patientId,
            Number(page),
            Number(limit),
        );
    }

    @Get('appointment/:id')
    @Roles(UserRole.MEDICO)
    @ApiOperation({ summary: 'Obtener historia clínica por cita' })
    async getByAppointment(@Param('id') appointmentId: string) {
        return await this.medicalRecordRepository.findByAppointmentId(appointmentId);
    }
}
