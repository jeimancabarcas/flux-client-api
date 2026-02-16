import { Controller, Post, Get, Query, UseInterceptors, UploadedFile, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums/user-role.enum';
import { ImportCumsUseCase } from '../../application/use-cases/import-cums.use-case';
import { SearchCumsUseCase } from '../../application/use-cases/search-cums.use-case';

@ApiTags('Catálogo CUMS (Medicamentos)')
@Controller('cums')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class CumsController {
    constructor(
        private readonly importCumsUseCase: ImportCumsUseCase,
        private readonly searchCumsUseCase: SearchCumsUseCase
    ) { }

    @Post('import')
    @Roles(UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Importar catálogo CUMS desde un archivo Excel (Solo Administrador)' })
    async importCums(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new HttpException('No se ha subido ningún archivo.', HttpStatus.BAD_REQUEST);
        }

        // Validar extensión
        const ext = file.originalname.split('.').pop();
        if (ext !== 'xlsx' && ext !== 'xls') {
            throw new HttpException('El archivo debe ser un Excel (.xlsx o .xls).', HttpStatus.BAD_REQUEST);
        }

        try {
            const result = await this.importCumsUseCase.execute(file.buffer);
            return {
                message: 'Catálogo CUMS importado correctamente.',
                totalProcessed: result.total
            };
        } catch (error) {
            throw new HttpException(`Error al importar el catálogo: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('search')
    @ApiOperation({ summary: 'Buscar medicamentos en el catálogo CUMS' })
    @ApiQuery({ name: 'term', description: 'Término de búsqueda (mínimo 3 caracteres)' })
    async search(@Query('term') term: string) {
        console.log(`Buscando medicamentos con término: "${term}"`);
        try {
            const result = await this.searchCumsUseCase.execute(term);
            console.log(`Resultados encontrados: ${result.length}`);
            return {
                success: true,
                data: result
            };
        } catch (error) {
            console.error(`Error en búsqueda CUMS: ${error.message}`);
            throw new HttpException(`Error al buscar medicamentos: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
