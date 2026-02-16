import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICumsRepository } from '../../../../domain/repositories/cums.repository.interface';
import { Cum } from '../../../../domain/entities/cum.entity';
import { CumTypeOrmEntity } from '../entities/cum.typeorm-entity';

@Injectable()
export class TypeOrmCumsRepository implements ICumsRepository {
    constructor(
        @InjectRepository(CumTypeOrmEntity)
        private readonly repository: Repository<CumTypeOrmEntity>,
    ) { }

    async saveMany(cums: Cum[]): Promise<void> {
        const entities = cums.map(cum => {
            const entity = new CumTypeOrmEntity();
            entity.expediente = cum.expediente;
            entity.producto = cum.producto;
            entity.titular = cum.titular;
            entity.registroSanitario = cum.registroSanitario;
            entity.fechaExpedicion = cum.fechaExpedicion;
            entity.fechaVencimiento = cum.fechaVencimiento;
            entity.estadoRegistro = cum.estadoRegistro;
            entity.expedienteCum = cum.expedienteCum;
            entity.consecutivo = cum.consecutivo;
            entity.cantidadCum = cum.cantidadCum;
            entity.descripcionComercial = cum.descripcionComercial;
            entity.estadoCum = cum.estadoCum;
            entity.fechaActivo = cum.fechaActivo;
            entity.fechaInactivo = cum.fechaInactivo;
            entity.muestraMedica = cum.muestraMedica;
            entity.unidad = cum.unidad;
            entity.atc = cum.atc;
            entity.descripcionAtc = cum.descripcionAtc;
            entity.viaAdministracion = cum.viaAdministracion;
            entity.concentracion = cum.concentracion;
            entity.principioActivo = cum.principioActivo;
            entity.unidadMedida = cum.unidadMedida;
            entity.cantidad = cum.cantidad;
            entity.unidadReferencia = cum.unidadReferencia;
            entity.formaFarmaceutica = cum.formaFarmaceutica;
            entity.nombreRol = cum.nombreRol;
            entity.tipoRol = cum.tipoRol;
            entity.modalidad = cum.modalidad;
            entity.ium = cum.ium;
            return entity;
        });

        // Use chunk to avoid large insert issues
        const chunkSize = 500;
        for (let i = 0; i < entities.length; i += chunkSize) {
            const chunk = entities.slice(i, i + chunkSize);
            await this.repository.save(chunk);
        }
    }

    async clear(): Promise<void> {
        await this.repository.clear();
    }

    async search(term: string): Promise<Cum[]> {
        const query = this.repository.createQueryBuilder('cum')
            .where('cum.producto ILIKE :term', { term: `%${term}%` })
            .orWhere('cum.principioActivo ILIKE :term', { term: `%${term}%` })
            .orWhere('cum.atc ILIKE :term', { term: `%${term}%` })
            .take(50)
            .getMany();

        const entities = await query;

        return entities.map(entity => new Cum(
            entity.id,
            entity.expediente,
            entity.producto,
            entity.titular,
            entity.registroSanitario,
            entity.fechaExpedicion,
            entity.fechaVencimiento,
            entity.estadoRegistro,
            entity.expedienteCum,
            entity.consecutivo,
            entity.cantidadCum,
            entity.descripcionComercial,
            entity.estadoCum,
            entity.fechaActivo,
            entity.fechaInactivo,
            entity.muestraMedica,
            entity.unidad,
            entity.atc,
            entity.descripcionAtc,
            entity.viaAdministracion,
            entity.concentracion,
            entity.principioActivo,
            entity.unidadMedida,
            entity.cantidad,
            entity.unidadReferencia,
            entity.formaFarmaceutica,
            entity.nombreRol,
            entity.tipoRol,
            entity.modalidad,
            entity.ium,
            entity.createdAt,
            entity.updatedAt
        ));
    }
}
