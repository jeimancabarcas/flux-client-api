import { User } from '../entities/user.entity';

export interface IUserRepository {
    create(user: User): Promise<User>;
    findByEmail(email: string, withDeleted?: boolean): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByCedula(cedula: string, withDeleted?: boolean): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: string, user: User): Promise<User>;
    delete(id: string): Promise<void>;
    softDelete(id: string): Promise<void>;
}

export const IUSER_REPOSITORY = Symbol('IUserRepository');
