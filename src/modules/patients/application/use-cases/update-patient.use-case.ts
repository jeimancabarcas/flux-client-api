import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { IPATIENT_REPOSITORY, type IPatientRepository } from '../../domain/repositories/patient.repository.interface';
import { Patient } from '../../domain/entities/patient.entity';
import { UpdatePatientDto } from '../../infrastructure/dtos/update-patient.dto';

@Injectable()
export class UpdatePatientUseCase {
    constructor(
        @Inject(IPATIENT_REPOSITORY)
        private readonly patientRepository: IPatientRepository,
    ) { }

    async execute(patientId: string, dto: UpdatePatientDto): Promise<Patient> {
        // 1. Verificar que el paciente existe
        const existingPatient = await this.patientRepository.findById(patientId);
        if (!existingPatient) {
            throw new NotFoundException('Paciente no encontrado');
        }

        // 2. Si se está actualizando el número de identificación, verificar que no exista otro paciente con ese número
        if (dto.numeroIdentificacion && dto.numeroIdentificacion !== existingPatient.numeroIdentificacion) {
            const patientWithSameId = await this.patientRepository.findByNumeroIdentificacion(dto.numeroIdentificacion);
            if (patientWithSameId && patientWithSameId.id !== patientId) {
                throw new ConflictException(
                    `Ya existe un paciente con el número de identificación ${dto.numeroIdentificacion}`
                );
            }
        }

        // 3. Crear el paciente actualizado con los nuevos valores
        const updatedPatient = new Patient(
            existingPatient.id,
            dto.nombres ?? existingPatient.nombres,
            dto.apellidos ?? existingPatient.apellidos,
            dto.tipoIdentificacion ?? existingPatient.tipoIdentificacion,
            dto.numeroIdentificacion ?? existingPatient.numeroIdentificacion,
            dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : existingPatient.fechaNacimiento,
            dto.genero ?? existingPatient.genero,
            dto.email !== undefined ? dto.email : existingPatient.email,
            dto.telefono ?? existingPatient.telefono,
            dto.direccion !== undefined ? dto.direccion : existingPatient.direccion,
            dto.habeasDataConsent ?? existingPatient.habeasDataConsent,
            existingPatient.createdAt,
            new Date(), // updatedAt
        );

        // 4. Guardar y retornar
        return this.patientRepository.update(patientId, updatedPatient);
    }
}
