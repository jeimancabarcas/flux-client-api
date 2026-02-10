import { Patient } from '../../../../domain/entities/patient.entity';
import { PatientTypeOrmEntity } from '../entities/patient.typeorm-entity';

export class PatientMapper {
    static toDomain(entity: PatientTypeOrmEntity): Patient {
        return new Patient(
            entity.id,
            entity.nombres,
            entity.apellidos,
            entity.tipoIdentificacion,
            entity.numeroIdentificacion,
            entity.fechaNacimiento,
            entity.genero,
            entity.email,
            entity.telefono,
            entity.direccion,
            entity.habeasDataConsent,
            entity.eps,
            entity.prepagada,
            entity.createdAt,
            entity.updatedAt,
        );
    }

    static toPersistence(domain: Patient): PatientTypeOrmEntity {
        const entity = new PatientTypeOrmEntity();
        if (domain.id) entity.id = domain.id;
        entity.nombres = domain.nombres;
        entity.apellidos = domain.apellidos;
        entity.tipoIdentificacion = domain.tipoIdentificacion;
        entity.numeroIdentificacion = domain.numeroIdentificacion;
        entity.fechaNacimiento = domain.fechaNacimiento;
        entity.genero = domain.genero;
        entity.email = domain.email ?? null;
        entity.telefono = domain.telefono;
        entity.direccion = domain.direccion ?? null;
        entity.habeasDataConsent = domain.habeasDataConsent;
        entity.eps = domain.eps ?? null;
        entity.prepagada = domain.prepagada ?? null;
        return entity;
    }
}
