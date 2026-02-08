import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums/user-role.enum';
import { CreateSpecialtyUseCase } from '../../application/use-cases/create-specialty.use-case';
import { ListSpecialtiesUseCase } from '../../application/use-cases/list-specialties.use-case';
import { AssignSpecialtiesToDoctorUseCase } from '../../application/use-cases/assign-specialties-to-doctor.use-case';
import { CreateSpecialtyDto } from '../dtos/create-specialty.dto';
import { AssignSpecialtiesDto } from '../dtos/assign-specialties.dto';

@ApiTags('Specialties')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('specialties')
export class SpecialtiesController {
    constructor(
        private readonly createSpecialtyUseCase: CreateSpecialtyUseCase,
        private readonly listSpecialtiesUseCase: ListSpecialtiesUseCase,
        private readonly assignSpecialtiesToDoctorUseCase: AssignSpecialtiesToDoctorUseCase,
    ) { }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Crear una nueva especialidad (Solo ADMIN)' })
    async create(@Body() dto: CreateSpecialtyDto) {
        return this.createSpecialtyUseCase.execute(dto);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA)
    @ApiOperation({ summary: 'Listar todas las especialidades' })
    async findAll() {
        return this.listSpecialtiesUseCase.execute();
    }

    @Post('assign/:doctorId')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Asignar especialidades a un médico (Solo ADMIN)' })
    async assignToDoctor(
        @Param('doctorId') doctorId: string,
        @Body() dto: AssignSpecialtiesDto,
    ) {
        return this.assignSpecialtiesToDoctorUseCase.execute(doctorId, dto.specialtyIds);
    }
}
