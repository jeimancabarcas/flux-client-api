import { Appointment } from '../../../../domain/entities/appointment.entity';
import { AppointmentTypeOrmEntity } from '../entities/appointment.typeorm-entity';
import { PatientMapper } from '../../../../../patients/infrastructure/persistence/typeorm/mappers/patient.mapper';
import { UserMapper } from '../../../../../users/infrastructure/persistence/typeorm/mappers/user.mapper';

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
            entity.patient ? PatientMapper.toDomain(entity.patient) : null,
            entity.doctor ? UserMapper.toDomain(entity.doctor) : null,
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

    static toResponse(appointment: Appointment) {
        return {
            ...appointment,
            doctor: appointment.doctor ? UserMapper.toResponse(appointment.doctor) : null,
        };
    }
}
