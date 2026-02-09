import { AppointmentStatus } from './appointment-status.enum';

export class Appointment {
    constructor(
        public readonly id: string | null,
        public readonly patientId: string,
        public readonly doctorId: string,
        public readonly startTime: Date,
        public readonly endTime: Date,
        public readonly status: AppointmentStatus,
        public readonly reason: string | null,
        public readonly notes: string | null,
        public readonly actualStartTime: Date | null = null,
        public readonly actualEndTime: Date | null = null,
        public readonly createdAt: Date | null = null,
        public readonly updatedAt: Date | null = null,
        public readonly patient: any | null = null,
        public readonly doctor: any | null = null,
    ) { }

    static create(
        patientId: string,
        doctorId: string,
        startTime: Date,
        durationMinutes: number,
        reason?: string,
    ): Appointment {
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
        return new Appointment(
            null,
            patientId,
            doctorId,
            startTime,
            endTime,
            AppointmentStatus.PENDIENTE,
            reason ?? null,
            null,
        );
    }
}
