import { MedicalRecord } from '../../../../domain/entities/medical-record.entity';
import { PediatricExtension } from '../../../../domain/entities/pediatric-extension.entity';
import { PatientBackground } from '../../../../domain/entities/patient-background.entity';
import { PhysicalExamination } from '../../../../domain/entities/physical-examination.entity';
import { MedicalRecordTypeOrmEntity } from '../entities/medical-record.typeorm-entity';
import { PediatricExtensionTypeOrmEntity } from '../entities/pediatric-extension.typeorm-entity';
import { PatientBackgroundTypeOrmEntity } from '../entities/patient-background.typeorm-entity';
import { PhysicalExaminationTypeOrmEntity } from '../entities/physical-examination.typeorm-entity';

export class MedicalRecordMapper {
    static toDomain(entity: MedicalRecordTypeOrmEntity): MedicalRecord {
        const pediatricExtension = entity.pediatricExtension
            ? new PediatricExtension(
                entity.pediatricExtension.id,
                entity.pediatricExtension.medicalRecordId,
                entity.pediatricExtension.weight !== null ? Number(entity.pediatricExtension.weight) : null,
                entity.pediatricExtension.height !== null ? Number(entity.pediatricExtension.height) : null,
                entity.pediatricExtension.cephalicPerimeter !== null ? Number(entity.pediatricExtension.cephalicPerimeter) : null,
                entity.pediatricExtension.abdominalPerimeter !== null ? Number(entity.pediatricExtension.abdominalPerimeter) : null,
                entity.pediatricExtension.perinatalHistory,
                entity.pediatricExtension.createdAt,
                entity.pediatricExtension.updatedAt,
            )
            : null;

        const patientBackground = entity.patientBackground
            ? new PatientBackground(
                entity.patientBackground.id,
                entity.patientBackground.medicalRecordId,
                entity.patientBackground.pathological,
                entity.patientBackground.surgical,
                entity.patientBackground.allergic,
                entity.patientBackground.pharmacological,
                entity.patientBackground.familyHistory,
                entity.patientBackground.reviewOfSystems,
                entity.patientBackground.createdAt,
                entity.patientBackground.updatedAt,
            )
            : null;

        const physicalExamination = entity.physicalExamination
            ? new PhysicalExamination(
                entity.physicalExamination.id,
                entity.physicalExamination.medicalRecordId,
                entity.physicalExamination.content,
                entity.physicalExamination.heartRate !== null ? Number(entity.physicalExamination.heartRate) : null,
                entity.physicalExamination.respiratoryRate !== null ? Number(entity.physicalExamination.respiratoryRate) : null,
                entity.physicalExamination.temperature !== null ? Number(entity.physicalExamination.temperature) : null,
                entity.physicalExamination.systolicBloodPressure !== null ? Number(entity.physicalExamination.systolicBloodPressure) : null,
                entity.physicalExamination.diastolicBloodPressure !== null ? Number(entity.physicalExamination.diastolicBloodPressure) : null,
                entity.physicalExamination.weight !== null ? Number(entity.physicalExamination.weight) : null,
                entity.physicalExamination.height !== null ? Number(entity.physicalExamination.height) : null,
                entity.physicalExamination.createdAt,
                entity.physicalExamination.updatedAt,
            )
            : null;

        return new MedicalRecord(
            entity.id,
            entity.appointmentId,
            entity.patientId,
            entity.doctorId,
            entity.reason,
            entity.currentIllness,
            entity.diagnoses,
            entity.prescriptions || [],
            entity.plan,
            physicalExamination,
            patientBackground,
            pediatricExtension,
            entity.createdAt,
            entity.updatedAt,
        );
    }

    static toPersistence(domain: MedicalRecord): MedicalRecordTypeOrmEntity {
        const entity = new MedicalRecordTypeOrmEntity();
        if (domain.id) entity.id = domain.id;
        entity.appointmentId = domain.appointmentId;
        entity.patientId = domain.patientId;
        entity.doctorId = domain.doctorId;
        entity.reason = domain.reason;
        entity.currentIllness = domain.currentIllness;
        entity.diagnoses = domain.diagnoses;
        entity.prescriptions = domain.prescriptions;
        entity.plan = domain.plan;

        if (domain.physicalExamination) {
            const peEntity = new PhysicalExaminationTypeOrmEntity();
            if (domain.physicalExamination.id) peEntity.id = domain.physicalExamination.id;
            peEntity.content = domain.physicalExamination.content as string;
            peEntity.heartRate = domain.physicalExamination.heartRate as number;
            peEntity.respiratoryRate = domain.physicalExamination.respiratoryRate as number;
            peEntity.temperature = domain.physicalExamination.temperature as number;
            peEntity.systolicBloodPressure = domain.physicalExamination.systolicBloodPressure as number;
            peEntity.diastolicBloodPressure = domain.physicalExamination.diastolicBloodPressure as number;
            peEntity.weight = domain.physicalExamination.weight as number;
            peEntity.height = domain.physicalExamination.height as number;

            entity.physicalExamination = peEntity;
            peEntity.medicalRecord = entity;
        }

        if (domain.patientBackground) {
            const backEntity = new PatientBackgroundTypeOrmEntity();
            if (domain.patientBackground.id) backEntity.id = domain.patientBackground.id;
            backEntity.pathological = domain.patientBackground.pathological as string;
            backEntity.surgical = domain.patientBackground.surgical as string;
            backEntity.allergic = domain.patientBackground.allergic as string;
            backEntity.pharmacological = domain.patientBackground.pharmacological as string;
            backEntity.familyHistory = domain.patientBackground.familyHistory as string;
            backEntity.reviewOfSystems = domain.patientBackground.reviewOfSystems as string;

            entity.patientBackground = backEntity;
            backEntity.medicalRecord = entity;
        }

        if (domain.pediatricExtension) {
            const extEntity = new PediatricExtensionTypeOrmEntity();
            if (domain.pediatricExtension.id) extEntity.id = domain.pediatricExtension.id;
            extEntity.weight = domain.pediatricExtension.weight as number;
            extEntity.height = domain.pediatricExtension.height as number;
            extEntity.cephalicPerimeter = domain.pediatricExtension.cephalicPerimeter as number;
            extEntity.abdominalPerimeter = domain.pediatricExtension.abdominalPerimeter as number;
            extEntity.perinatalHistory = domain.pediatricExtension.perinatalHistory as string;

            entity.pediatricExtension = extEntity;
            extEntity.medicalRecord = entity;
        }

        return entity;
    }
}
