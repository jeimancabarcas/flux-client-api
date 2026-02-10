import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateEpsUseCase } from '../../application/use-cases/create-eps.use-case';
import { ListEpsUseCase } from '../../application/use-cases/list-eps.use-case';
import { UpdateEpsUseCase } from '../../application/use-cases/update-eps.use-case';
import { DeleteEpsUseCase } from '../../application/use-cases/delete-eps.use-case';
import { CreateEpsDto } from '../dtos/create-eps.dto';
import { UpdateEpsDto } from '../dtos/update-eps.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums/user-role.enum';

@ApiTags('Masters - EPS')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('masters/eps')
export class EpsController {
    constructor(
        private readonly createEpsUseCase: CreateEpsUseCase,
        private readonly listEpsUseCase: ListEpsUseCase,
        private readonly updateEpsUseCase: UpdateEpsUseCase,
        private readonly deleteEpsUseCase: DeleteEpsUseCase,
    ) { }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Crear una nueva EPS' })
    async create(@Body() dto: CreateEpsDto) {
        return this.createEpsUseCase.execute(dto);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.MEDICO)
    @ApiOperation({ summary: 'Listar todas las EPS' })
    async findAll() {
        return this.listEpsUseCase.execute();
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Actualizar una EPS' })
    async update(@Param('id') id: string, @Body() dto: UpdateEpsDto) {
        return this.updateEpsUseCase.execute(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Eliminar una EPS' })
    async remove(@Param('id') id: string) {
        return this.deleteEpsUseCase.execute(id);
    }
}
