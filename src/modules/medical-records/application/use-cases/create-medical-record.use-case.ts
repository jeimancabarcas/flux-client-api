import { Injectable, Inject } from '@nestjs/common';
import { IMEDICAL_RECORD_REPOSITORY, type IMedicalRecordRepository } from '../../domain/repositories/medical-record.repository.interface';
import { CreateMedicalRecordDto } from '../../infrastructure/dtos/create-medical-record.dto';
import { MedicalRecord } from '../../domain/entities/medical-record.entity';
import { PediatricExtension } from '../../domain/entities/pediatric-extension.entity';
import { PatientBackground } from '../../domain/entities/patient-background.entity';
import { PhysicalExamination } from '../../domain/entities/physical-examination.entity';

@Injectable()
export class CreateMedicalRecordUseCase {
    constructor(
        @Inject(IMEDICAL_RECORD_REPOSITORY)
        private readonly medicalRecordRepository: IMedicalRecordRepository,
    ) { }

    async execute(dto: CreateMedicalRecordDto, doctorId: string): Promise<MedicalRecord> {
        let pediatricExtension: PediatricExtension | null = null;
        if (dto.pediatricExtension) {
            pediatricExtension = new PediatricExtension(
                null,
                null,
                dto.pediatricExtension.weight || null,
                dto.pediatricExtension.height || null,
                dto.pediatricExtension.cephalicPerimeter || null,
                dto.pediatricExtension.abdominalPerimeter || null,
                dto.pediatricExtension.perinatalHistory || null,
            );
        }

        let patientBackground: PatientBackground | null = null;
        if (dto.patientBackground) {
            patientBackground = new PatientBackground(
                null,
                null,
                dto.patientBackground.pathological || null,
                dto.patientBackground.surgical || null,
                dto.patientBackground.allergic || null,
                dto.patientBackground.pharmacological || null,
                dto.patientBackground.familyHistory || null,
                dto.patientBackground.reviewOfSystems || null,
            );
        }

        let physicalExamination: PhysicalExamination | null = null;
        if (dto.physicalExamination) {
            physicalExamination = new PhysicalExamination(
                null,
                null,
                dto.physicalExamination.content || null,
                dto.physicalExamination.heartRate || null,
                dto.physicalExamination.respiratoryRate || null,
                dto.physicalExamination.temperature || null,
                dto.physicalExamination.systolicBloodPressure || null,
                dto.physicalExamination.diastolicBloodPressure || null,
                dto.physicalExamination.weight || null,
                dto.physicalExamination.height || null,
            );
        }

        const medicalRecord = new MedicalRecord(
            null,
            dto.appointmentId,
            dto.patientId,
            doctorId,
            dto.reason,
            dto.currentIllness,
            dto.diagnoses,
            dto.prescriptions || [],
            dto.plan,
            physicalExamination,
            patientBackground,
            pediatricExtension,
        );

        return await this.medicalRecordRepository.save(medicalRecord);
    }
}
