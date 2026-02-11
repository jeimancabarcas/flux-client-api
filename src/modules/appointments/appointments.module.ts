import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/appointment.typeorm-entity';
import { AppointmentsController } from './infrastructure/controllers/appointments.controller';
import { ScheduleAppointmentUseCase } from './application/use-cases/schedule-appointment.use-case';
import { StartAppointmentUseCase } from './application/use-cases/start-appointment.use-case';
import { CompleteAppointmentUseCase } from './application/use-cases/complete-appointment.use-case';
import { CancelAppointmentUseCase } from './application/use-cases/cancel-appointment.use-case';
import { ConfirmAppointmentUseCase } from './application/use-cases/confirm-appointment.use-case';
import { ListAppointmentsUseCase } from './application/use-cases/list-appointments.use-case';
import { GetDoctorNextAppointmentsUseCase } from './application/use-cases/get-doctor-next-appointments.use-case';
import { GetAppointmentUseCase } from './application/use-cases/get-appointment.use-case';
import { GetActiveConsultationUseCase } from './application/use-cases/get-active-consultation.use-case';
import { RescheduleAppointmentUseCase } from './application/use-cases/reschedule-appointment.use-case';
import { DeleteAppointmentUseCase } from './application/use-cases/delete-appointment.use-case';
import { ListPatientAppointmentsUseCase } from './application/use-cases/list-patient-appointments.use-case';
import { GetPatientNextAppointmentUseCase } from './application/use-cases/get-patient-next-appointment.use-case';
import { IAPPOINTMENT_REPOSITORY } from './domain/repositories/appointment.repository.interface';
import { TypeOrmAppointmentRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-appointment.repository';
import { MastersModule } from '../masters/masters.module';
import { BillingModule } from '../billing/billing.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([AppointmentTypeOrmEntity]),
        MastersModule,
        BillingModule
    ],
    controllers: [AppointmentsController],
    providers: [
        ScheduleAppointmentUseCase,
        StartAppointmentUseCase,
        CompleteAppointmentUseCase,
        CancelAppointmentUseCase,
        ConfirmAppointmentUseCase,
        ListAppointmentsUseCase,
        GetDoctorNextAppointmentsUseCase,
        GetAppointmentUseCase,
        GetActiveConsultationUseCase,
        RescheduleAppointmentUseCase,
        DeleteAppointmentUseCase,
        ListPatientAppointmentsUseCase,
        GetPatientNextAppointmentUseCase,
        {
            provide: IAPPOINTMENT_REPOSITORY,
            useClass: TypeOrmAppointmentRepository,
        },
    ],
    exports: [IAPPOINTMENT_REPOSITORY],
})
export class AppointmentsModule { }
