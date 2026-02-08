import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/appointment.typeorm-entity';
import { AppointmentsController } from './infrastructure/controllers/appointments.controller';
import { ScheduleAppointmentUseCase } from './application/use-cases/schedule-appointment.use-case';
import { StartAppointmentUseCase } from './application/use-cases/start-appointment.use-case';
import { CompleteAppointmentUseCase } from './application/use-cases/complete-appointment.use-case';
import { CancelAppointmentUseCase } from './application/use-cases/cancel-appointment.use-case';
import { ListAppointmentsUseCase } from './application/use-cases/list-appointments.use-case';
import { IAPPOINTMENT_REPOSITORY } from './domain/repositories/appointment.repository.interface';
import { TypeOrmAppointmentRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-appointment.repository';

@Module({
    imports: [TypeOrmModule.forFeature([AppointmentTypeOrmEntity])],
    controllers: [AppointmentsController],
    providers: [
        ScheduleAppointmentUseCase,
        StartAppointmentUseCase,
        CompleteAppointmentUseCase,
        CancelAppointmentUseCase,
        ListAppointmentsUseCase,
        {
            provide: IAPPOINTMENT_REPOSITORY,
            useClass: TypeOrmAppointmentRepository,
        },
    ],
    exports: [IAPPOINTMENT_REPOSITORY],
})
export class AppointmentsModule { }
