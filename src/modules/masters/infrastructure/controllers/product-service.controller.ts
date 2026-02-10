import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateProductServiceUseCase } from '../../application/use-cases/create-product-service.use-case';
import { ListProductServicesUseCase } from '../../application/use-cases/list-product-services.use-case';
import { UpdateProductServiceUseCase } from '../../application/use-cases/update-product-service.use-case';
import { DeleteProductServiceUseCase } from '../../application/use-cases/delete-product-service.use-case';
import { CreateProductServiceDto } from '../dtos/create-product-service.dto';
import { UpdateProductServiceDto } from '../dtos/update-product-service.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums/user-role.enum';

@ApiTags('Masters - Catalog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('masters/catalog')
export class ProductServiceController {
    constructor(
        private readonly createUseCase: CreateProductServiceUseCase,
        private readonly listUseCase: ListProductServicesUseCase,
        private readonly updateUseCase: UpdateProductServiceUseCase,
        private readonly deleteUseCase: DeleteProductServiceUseCase,
    ) { }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Crear un nuevo producto o servicio (CUPS/CUMS)' })
    async create(@Body() dto: CreateProductServiceDto) {
        return this.createUseCase.execute(dto);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.MEDICO)
    @ApiOperation({ summary: 'Listar todos los productos y servicios' })
    async findAll() {
        return this.listUseCase.execute();
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Actualizar un producto o servicio' })
    async update(@Param('id') id: string, @Body() dto: UpdateProductServiceDto) {
        return this.updateUseCase.execute(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Eliminar un producto o servicio' })
    async remove(@Param('id') id: string) {
        return this.deleteUseCase.execute(id);
    }
}
