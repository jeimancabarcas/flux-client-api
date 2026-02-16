import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums/user-role.enum';
import { ImportCumsUseCase } from '../../application/use-cases/import-cums.use-case';

@ApiTags('Catálogo CUMS (Medicamentos)')
@Controller('cums')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class CumsController {
    constructor(private readonly importCumsUseCase: ImportCumsUseCase) { }

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
}
