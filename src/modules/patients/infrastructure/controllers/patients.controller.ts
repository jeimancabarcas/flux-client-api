import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RegisterPatientUseCase } from '../../application/use-cases/register-patient.use-case';
import { GetPatientSummaryUseCase } from '../../application/use-cases/get-patient-summary.use-case';
import { SearchPatientUseCase } from '../../application/use-cases/search-patient.use-case';
import { ListPatientsUseCase } from '../../application/use-cases/list-patients.use-case';
import { UpdatePatientUseCase } from '../../application/use-cases/update-patient.use-case';
import { CreatePatientDto } from '../dtos/create-patient.dto';
import { UpdatePatientDto } from '../dtos/update-patient.dto';
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
        private readonly listPatientsUseCase: ListPatientsUseCase,
        private readonly updatePatientUseCase: UpdatePatientUseCase,
    ) { }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
    @ApiOperation({ summary: 'Registrar un nuevo paciente' })
    @ApiResponse({ status: 201, description: 'Paciente registrado exitosamente.' })
    async create(@Body() dto: CreatePatientDto) {
        return this.registerPatientUseCase.execute(dto);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.MEDICO)
    @ApiOperation({ summary: 'Listar pacientes con paginación' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('search') search?: string,
    ) {
        return this.listPatientsUseCase.execute(Number(page) || 1, Number(limit) || 10, search);
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

    @Patch(':id')
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
    @ApiOperation({ summary: 'Actualizar información del paciente' })
    @ApiResponse({ status: 200, description: 'Paciente actualizado exitosamente.' })
    @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
    async update(
        @Param('id') id: string,
        @Body() updatePatientDto: UpdatePatientDto,
    ) {
        return this.updatePatientUseCase.execute(id, updatePatientDto);
    }
}
