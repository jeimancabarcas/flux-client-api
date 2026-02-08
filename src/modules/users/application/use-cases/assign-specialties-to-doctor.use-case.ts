import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IUSER_REPOSITORY, type IUserRepository } from '../../domain/repositories/user.repository.interface';
import { ISPECIALTY_REPOSITORY, type ISpecialtyRepository } from '../../domain/repositories/specialty.repository.interface';
import { UserRole } from '../../../../common/enums/user-role.enum';

@Injectable()
export class AssignSpecialtiesToDoctorUseCase {
    constructor(
        @Inject(IUSER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(ISPECIALTY_REPOSITORY)
        private readonly specialtyRepository: ISpecialtyRepository,
    ) { }

    async execute(doctorId: string, specialtyIds: string[]): Promise<void> {
        const doctor = await this.userRepository.findById(doctorId);

        if (!doctor) {
            throw new NotFoundException('Médico no encontrado');
        }

        if (doctor.role !== UserRole.MEDICO) {
            throw new ForbiddenException('Solo se pueden asignar especialidades a usuarios con rol MEDICO');
        }

        const specialties = await this.specialtyRepository.findManyByIds(specialtyIds);

        if (specialties.length !== specialtyIds.length) {
            throw new NotFoundException('Una o más especialidades no existen');
        }

        doctor.specialties = specialties;

        await this.userRepository.update(doctorId, doctor);
    }
}
