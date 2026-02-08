import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/appointment.typeorm-entity';
import { AppointmentsController } from './infrastructure/controllers/appointments.controller';
import { ScheduleAppointmentUseCase } from './application/use-cases/schedule-appointment.use-case';
import { UpdateAppointmentStatusUseCase } from './application/use-cases/update-appointment-status.use-case';
import { ListAppointmentsUseCase } from './application/use-cases/list-appointments.use-case';
import { IAPPOINTMENT_REPOSITORY } from './domain/repositories/appointment.repository.interface';
import { TypeOrmAppointmentRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-appointment.repository';

@Module({
    imports: [TypeOrmModule.forFeature([AppointmentTypeOrmEntity])],
    controllers: [AppointmentsController],
    providers: [
        ScheduleAppointmentUseCase,
        UpdateAppointmentStatusUseCase,
        ListAppointmentsUseCase,
        {
            provide: IAPPOINTMENT_REPOSITORY,
            useClass: TypeOrmAppointmentRepository,
        },
    ],
    exports: [IAPPOINTMENT_REPOSITORY],
})
export class AppointmentsModule { }
