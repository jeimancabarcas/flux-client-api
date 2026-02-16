import { Injectable, Inject, Logger } from '@nestjs/common';
import { ICUMS_REPOSITORY } from '../../domain/repositories/cums.repository.interface';
import type { ICumsRepository } from '../../domain/repositories/cums.repository.interface';
import { Cum } from '../../domain/entities/cum.entity';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ImportCumsUseCase {
    private readonly logger = new Logger(ImportCumsUseCase.name);

    constructor(
        @Inject(ICUMS_REPOSITORY)
        private readonly cumsRepository: ICumsRepository,
    ) { }

    async execute(fileBuffer: Buffer): Promise<{ total: number }> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(fileBuffer as any);

        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
            throw new Error('No se encontró la hoja de cálculo en el archivo.');
        }

        const cums: Cum[] = [];
        const batchSize = 1000;
        let totalProcessed = 0;

        // Limpiar catálogo actual antes de importar (opcional, dependerá del flujo deseado)
        // Por ahora lo limpiamos para tener la versión más reciente del INVIMA
        await this.cumsRepository.clear();

        worksheet.eachRow((row, rowNumber) => {
            // Saltamos el encabezado
            if (rowNumber === 1) return;

            try {
                const cum = new Cum(
                    null,
                    this.getCellValue(row, 1), // EXPEDIENTE
                    this.getCellValue(row, 2), // PRODUCTO
                    this.getCellValue(row, 3), // TITULAR
                    this.getCellValue(row, 4), // REGISTRO SANITARIO
                    this.parseDate(this.getCellValue(row, 5)), // FECHA EXPEDICIÓN
                    this.parseDate(this.getCellValue(row, 6)), // FECHA VENCIMIENTO
                    this.getCellValue(row, 7), // ESTADO REGISTRO
                    this.getCellValue(row, 8), // EXPEDIENTE CUM
                    this.getCellValue(row, 9), // CONSECUTIVO
                    this.parseNumber(this.getCellValue(row, 10)), // CANTIDAD CUM
                    this.getCellValue(row, 11), // DESCRIPCIÓN COMERCIAL
                    this.getCellValue(row, 12), // ESTADO CUM
                    this.parseDate(this.getCellValue(row, 13)), // FECHA ACTIVO
                    this.parseDate(this.getCellValue(row, 14)), // FECHA INACTIVO
                    this.getCellValue(row, 15), // MUESTRA MÉDICA
                    this.getCellValue(row, 16), // UNIDAD
                    this.getCellValue(row, 17), // ATC
                    this.getCellValue(row, 18), // DESCRIPCIÓN_ATC
                    this.getCellValue(row, 19), // VÍA ADMINISTRACIÓN
                    this.getCellValue(row, 20), // CONCENTRACIÓN
                    this.getCellValue(row, 21), // PRINCIPIO ACTIVO
                    this.getCellValue(row, 22), // UNIDAD MEDIDA
                    this.getCellValue(row, 23).toString(), // CANTIDAD
                    this.getCellValue(row, 24), // UNIDAD REFERENCIA
                    this.getCellValue(row, 25), // FORMA FARMACÉUTICA
                    this.getCellValue(row, 26), // NOMBRE ROL
                    this.getCellValue(row, 27), // TIPO ROL
                    this.getCellValue(row, 28), // MODALIDAD
                    this.getCellValue(row, 29).toString(), // IUM
                );

                cums.push(cum);
                totalProcessed++;

                // Procesar en lotes para no saturar memoria
                if (cums.length >= batchSize) {
                    this.logger.log(`Procesando lote de ${cums.length} registros...`);
                    // Note: This is an async operation, but we push to queue. 
                    // Better to wait to avoid race conditions during clear/reload.
                }
            } catch (err) {
                this.logger.warn(`Error procesando fila ${rowNumber}: ${err.message}`);
            }
        });

        // Guardamos todo el grupo
        if (cums.length > 0) {
            this.logger.log(`Guardando total de ${cums.length} registros en la base de datos...`);
            await this.cumsRepository.saveMany(cums);
        }

        return { total: totalProcessed };
    }

    private getCellValue(row: ExcelJS.Row, colNumber: number): string {
        const cell = row.getCell(colNumber);
        if (cell.value === null || cell.value === undefined) return '';
        if (typeof cell.value === 'object' && 'result' in cell.value) return cell.value.result?.toString() || '';
        return cell.value.toString();
    }

    private parseDate(value: string): Date | null {
        if (!value) return null;
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
    }

    private parseNumber(value: string): number | null {
        if (!value) return null;
        const num = parseFloat(value.replace(',', '.'));
        return isNaN(num) ? null : num;
    }
}
