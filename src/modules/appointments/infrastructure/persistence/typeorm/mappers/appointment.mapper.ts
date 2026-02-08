import { Appointment } from '../../../../domain/entities/appointment.entity';
import { AppointmentTypeOrmEntity } from '../entities/appointment.typeorm-entity';

export class AppointmentMapper {
    static toDomain(entity: AppointmentTypeOrmEntity): Appointment {
        return new Appointment(
            entity.id,
            entity.patientId,
            entity.doctorId,
            entity.startTime,
            entity.endTime,
            entity.status,
            entity.reason,
            entity.notes,
            entity.actualStartTime,
            entity.actualEndTime,
            entity.createdAt,
            entity.updatedAt,
        );
    }

    static toPersistence(domain: Appointment): AppointmentTypeOrmEntity {
        const entity = new AppointmentTypeOrmEntity();
        if (domain.id) entity.id = domain.id;
        entity.patientId = domain.patientId;
        entity.doctorId = domain.doctorId;
        entity.startTime = domain.startTime;
        entity.endTime = domain.endTime;
        entity.status = domain.status;
        entity.reason = domain.reason;
        entity.notes = domain.notes;
        entity.actualStartTime = domain.actualStartTime;
        entity.actualEndTime = domain.actualEndTime;
        return entity;
    }
}
