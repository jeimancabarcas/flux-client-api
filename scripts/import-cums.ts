import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ImportCumsUseCase } from '../src/modules/cums/application/use-cases/import-cums.use-case';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const logger = new Logger('CumsSeeder');
    logger.log('Iniciando importación de CUMS desde el disco...');

    const app = await NestFactory.createApplicationContext(AppModule);
    const importCumsUseCase = app.get(ImportCumsUseCase);

    const dataDir = path.join(__dirname, '../data');

    // Buscar el primer archivo .xlsx o .xls en la carpeta data
    const files = fs.readdirSync(dataDir);
    const excelFile = files.find(f => f.endsWith('.xlsx') || f.endsWith('.xls'));

    if (!excelFile) {
        logger.error('No se encontró ningún archivo Excel (.xlsx o .xls) en la carpeta /data');
        logger.warn('Ubicación buscada: ' + dataDir);
        await app.close();
        process.exit(1);
    }

    const filePath = path.join(dataDir, excelFile);
    logger.log(`Archivo encontrado: ${excelFile}`);

    try {
        const fileBuffer = fs.readFileSync(filePath);
        logger.log('Leyendo y procesando el archivo...');

        const result = await importCumsUseCase.execute(fileBuffer);

        logger.log(`--- IMPORTACIÓN EXITOSA ---`);
        logger.log(`Total de registros procesados e insertados: ${result.total}`);
        logger.log('---------------------------');
    } catch (error) {
        logger.error('Error durante la importación:', error.message);
        if (error.stack) {
            console.error(error.stack);
        }
    } finally {
        await app.close();
    }
}

bootstrap();
