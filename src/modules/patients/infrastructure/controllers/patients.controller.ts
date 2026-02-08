import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterPatientUseCase } from '../../application/use-cases/register-patient.use-case';
import { GetPatientSummaryUseCase } from '../../application/use-cases/get-patient-summary.use-case';
import { SearchPatientUseCase } from '../../application/use-cases/search-patient.use-case';
import { CreatePatientDto } from '../dtos/create-patient.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums/user-role.enum';

@ApiTags('Patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('patients')
export class PatientsController {
    constructor(
        private readonly registerPatientUseCase: RegisterPatientUseCase,
        private readonly getPatientSummaryUseCase: GetPatientSummaryUseCase,
        private readonly searchPatientUseCase: SearchPatientUseCase,
    ) { }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
    @ApiOperation({ summary: 'Registrar un nuevo paciente' })
    @ApiResponse({ status: 201, description: 'Paciente registrado exitosamente.' })
    async create(@Body() dto: CreatePatientDto) {
        return this.registerPatientUseCase.execute(dto);
    }

    @Get('search')
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.MEDICO)
    @ApiOperation({ summary: 'Buscar pacientes por nombre o identificación' })
    async search(@Query('query') query: string) {
        return this.searchPatientUseCase.execute(query);
    }

    @Get(':id/summary')
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.MEDICO)
    @ApiOperation({ summary: 'Obtener resumen y historial del paciente' })
    async getSummary(@Param('id') id: string) {
        return this.getPatientSummaryUseCase.execute(id);
    }
}
