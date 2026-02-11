import { Appointment } from '../../../../domain/entities/appointment.entity';
import { AppointmentTypeOrmEntity } from '../entities/appointment.typeorm-entity';
import { PatientMapper } from '../../../../../patients/infrastructure/persistence/typeorm/mappers/patient.mapper';
import { UserMapper } from '../../../../../users/infrastructure/persistence/typeorm/mappers/user.mapper';
import { ProductServiceMapper } from '../../../../../masters/infrastructure/persistence/typeorm/mappers/product-service.mapper';

export class AppointmentMapper {
    static toDomain(entity: AppointmentTypeOrmEntity): Appointment {
        let items: any[] = [];
        if (entity.invoices && entity.invoices.length > 0) {
            // Asumimos que la primera factura tiene los items actuales
            const invoice = entity.invoices[0];
            if (invoice.items) {
                items = invoice.items.map(item => {
                    if (item.productService) {
                        return ProductServiceMapper.toDomain(item.productService);
                    }
                    // Si no está cargada la relación, al menos devolvemos un objeto parcial o lo ignoramos
                    return null;
                }).filter(i => i !== null);
            }
        }

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
            items,
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

        // Ya no persistimos items directamente en la tabla de citas
        return entity;
    }

    static toResponse(appointment: Appointment) {
        return {
            id: appointment.id,
            patientId: appointment.patientId,
            doctorId: appointment.doctorId,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            status: appointment.status,
            reason: appointment.reason,
            notes: appointment.notes,
            actualStartTime: appointment.actualStartTime,
            actualEndTime: appointment.actualEndTime,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt,
            patient: appointment.patient,
            doctor: appointment.doctor ? UserMapper.toResponse(appointment.doctor) : null,
            items: appointment.items || [],
        };
    }
}
