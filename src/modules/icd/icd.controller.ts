import { Controller, Post, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { IcdService } from './icd.service';
import { JwtAuthGuard } from '../auth/infrastructure/guards/jwt-auth.guard';
import { SearchIcdDto } from './dto/search-icd.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('ICD-11 (CIE-11)')
@Controller('icd')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class IcdController {
    constructor(private readonly icdService: IcdService) { }

    @Post('search')
    @ApiConsumes('application/x-www-form-urlencoded', 'multipart/form-data')
    @UseInterceptors(FileInterceptor('none')) // none as in no file expected but handles multipart
    @ApiOperation({ summary: 'Buscar diagnósticos en ICD-11 (CIE-11)' })
    async search(@Body() searchDto: SearchIcdDto) {
        return await this.icdService.search(searchDto);
    }
}
