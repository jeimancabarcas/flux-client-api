import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan, Brackets } from 'typeorm';
import { IAppointmentRepository } from '../../../../domain/repositories/appointment.repository.interface';
import { Appointment } from '../../../../domain/entities/appointment.entity';
import { AppointmentStatus } from '../../../../domain/entities/appointment-status.enum';
import { AppointmentTypeOrmEntity } from '../entities/appointment.typeorm-entity';
import { AppointmentMapper } from '../mappers/appointment.mapper';

@Injectable()
export class TypeOrmAppointmentRepository implements IAppointmentRepository {
    constructor(
        @InjectRepository(AppointmentTypeOrmEntity)
        private readonly repository: Repository<AppointmentTypeOrmEntity>,
    ) { }

    async save(appointment: Appointment): Promise<Appointment> {
        const entity = AppointmentMapper.toPersistence(appointment);
        const saved = await this.repository.save(entity);
        // Recargar con relaciones para devolver la información completa si es necesario
        return this.findById(saved.id) as Promise<Appointment>;
    }

    async findById(id: string): Promise<Appointment | null> {
        const entity = await this.repository.findOne({
            where: { id },
            relations: ['patient', 'doctor', 'doctor.details', 'doctor.specialties', 'items']
        });
        return entity ? AppointmentMapper.toDomain(entity) : null;
    }

    async findByDoctorAndRange(
        doctorId: string,
        start: Date,
        end: Date,
    ): Promise<Appointment[]> {
        const entities = await this.repository.createQueryBuilder('appointment')
            .leftJoinAndSelect('appointment.patient', 'patient')
            .leftJoinAndSelect('appointment.doctor', 'doctor')
            .leftJoinAndSelect('doctor.details', 'details')
            .leftJoinAndSelect('appointment.items', 'items')
            .where('appointment.doctorId = :doctorId', { doctorId })
            .andWhere('appointment.status NOT IN (:...excludedStatuses)', {
                excludedStatuses: [AppointmentStatus.CANCELADA]
            })
            .andWhere(new Brackets(qb => {
                qb.where('appointment.startTime < :end AND appointment.endTime > :start', { start, end });
            }))
            .getMany();

        return entities.map(AppointmentMapper.toDomain);
    }

    async findAll(filters?: {
        doctorId?: string;
        patientId?: string;
        status?: AppointmentStatus;
        start?: Date;
        end?: Date;
        order?: 'ASC' | 'DESC';
    }): Promise<Appointment[]> {
        const qb = this.repository.createQueryBuilder('appointment')
            .leftJoinAndSelect('appointment.patient', 'patient')
            .leftJoinAndSelect('appointment.doctor', 'doctor')
            .leftJoinAndSelect('doctor.details', 'details')
            .leftJoinAndSelect('doctor.specialties', 'specialties')
            .leftJoinAndSelect('appointment.items', 'items');

        if (filters?.doctorId) qb.andWhere('appointment.doctorId = :doctorId', { doctorId: filters.doctorId });
        if (filters?.patientId) qb.andWhere('appointment.patientId = :patientId', { patientId: filters.patientId });
        if (filters?.status) qb.andWhere('appointment.status = :status', { status: filters.status });
        if (filters?.start && filters?.end) {
            qb.andWhere('appointment.startTime BETWEEN :start AND :end', { start: filters.start, end: filters.end });
        }

        qb.orderBy('appointment.startTime', filters?.order || 'ASC');

        const entities = await qb.getMany();
        return entities.map(AppointmentMapper.toDomain);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
