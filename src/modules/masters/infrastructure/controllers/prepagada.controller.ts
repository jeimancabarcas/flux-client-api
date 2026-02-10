import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreatePrepagadaUseCase } from '../../application/use-cases/create-prepagada.use-case';
import { ListPrepagadaUseCase } from '../../application/use-cases/list-prepagada.use-case';
import { UpdatePrepagadaUseCase } from '../../application/use-cases/update-prepagada.use-case';
import { DeletePrepagadaUseCase } from '../../application/use-cases/delete-prepagada.use-case';
import { CreatePrepagadaDto } from '../dtos/create-prepagada.dto';
import { UpdatePrepagadaDto } from '../dtos/update-prepagada.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums/user-role.enum';

@ApiTags('Masters - Prepagada')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('masters/prepagada')
export class PrepagadaController {
    constructor(
        private readonly createPrepagadaUseCase: CreatePrepagadaUseCase,
        private readonly listPrepagadaUseCase: ListPrepagadaUseCase,
        private readonly updatePrepagadaUseCase: UpdatePrepagadaUseCase,
        private readonly deletePrepagadaUseCase: DeletePrepagadaUseCase,
    ) { }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Crear una nueva medicina prepagada' })
    async create(@Body() dto: CreatePrepagadaDto) {
        return this.createPrepagadaUseCase.execute(dto);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.MEDICO)
    @ApiOperation({ summary: 'Listar todas las medicinas prepagadas' })
    async findAll() {
        return this.listPrepagadaUseCase.execute();
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Actualizar una medicina prepagada' })
    async update(@Param('id') id: string, @Body() dto: UpdatePrepagadaDto) {
        return this.updatePrepagadaUseCase.execute(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Eliminar una medicina prepagada' })
    async remove(@Param('id') id: string) {
        return this.deletePrepagadaUseCase.execute(id);
    }
}
