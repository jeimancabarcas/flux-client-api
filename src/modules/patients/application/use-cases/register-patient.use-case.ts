import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { Patient } from '../../domain/entities/patient.entity';
import { IPATIENT_REPOSITORY, type IPatientRepository } from '../../domain/repositories/patient.repository.interface';
import { CreatePatientDto } from '../../infrastructure/dtos/create-patient.dto';

@Injectable()
export class RegisterPatientUseCase {
    constructor(
        @Inject(IPATIENT_REPOSITORY)
        private readonly patientRepository: IPatientRepository,
    ) { }

    async execute(dto: CreatePatientDto): Promise<Patient> {
        const existingPatient = await this.patientRepository.findByIdentification(dto.numeroIdentificacion);
        if (existingPatient) {
            throw new ConflictException(`El paciente con identificación ${dto.numeroIdentificacion} ya existe.`);
        }

        const patient = new Patient(
            null,
            dto.nombres,
            dto.apellidos,
            dto.tipoIdentificacion,
            dto.numeroIdentificacion,
            new Date(dto.fechaNacimiento),
            dto.genero,
            dto.email ?? null,
            dto.telefono,
            dto.direccion ?? null,
            dto.habeasDataConsent,
        );

        return this.patientRepository.save(patient);
    }
}
