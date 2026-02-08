import { Specialty } from '../entities/specialty.entity';

export interface ISpecialtyRepository {
    save(specialty: Specialty): Promise<Specialty>;
    findAll(): Promise<Specialty[]>;
    findById(id: string): Promise<Specialty | null>;
    findManyByIds(ids: string[]): Promise<Specialty[]>;
    delete(id: string): Promise<void>;
}

export const ISPECIALTY_REPOSITORY = Symbol('ISpecialtyRepository');
