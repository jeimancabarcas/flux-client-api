import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums/user-role.enum';
import { CreateAgreementUseCase } from '../../application/use-cases/create-agreement.use-case';
import { ListAgreementsUseCase } from '../../application/use-cases/list-agreements.use-case';
import { UpdateAgreementUseCase } from '../../application/use-cases/update-agreement.use-case';
import { DeleteAgreementUseCase } from '../../application/use-cases/delete-agreement.use-case';
import { CreateAgreementDto } from '../dtos/create-agreement.dto';
import { UpdateAgreementDto } from '../dtos/update-agreement.dto';

@ApiTags('Maestros - Convenios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('masters/agreements')
export class AgreementsController {
    constructor(
        private readonly createAgreementUseCase: CreateAgreementUseCase,
        private readonly listAgreementsUseCase: ListAgreementsUseCase,
        private readonly updateAgreementUseCase: UpdateAgreementUseCase,
        private readonly deleteAgreementUseCase: DeleteAgreementUseCase,
    ) { }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Crear un nuevo convenio' })
    async create(@Body() dto: CreateAgreementDto) {
        return await this.createAgreementUseCase.execute(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar convenios' })
    async findAll(
        @Query('prepagadaId') prepagadaId?: string,
        @Query('isActive') isActive?: boolean,
    ) {
        return await this.listAgreementsUseCase.execute({ prepagadaId, isActive });
    }

    @Put(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Actualizar un convenio' })
    async update(@Param('id') id: string, @Body() dto: UpdateAgreementDto) {
        return await this.updateAgreementUseCase.execute(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Eliminar un convenio' })
    async delete(@Param('id') id: string) {
        await this.deleteAgreementUseCase.execute(id);
        return { message: 'Convenio eliminado correctamente' };
    }
}
