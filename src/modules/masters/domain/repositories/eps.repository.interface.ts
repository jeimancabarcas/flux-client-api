import { Eps } from '../entities/eps.entity';

export interface IEpsRepository {
    save(eps: Eps): Promise<Eps>;
    findById(id: string): Promise<Eps | null>;
    findAll(): Promise<Eps[]>;
    delete(id: string): Promise<void>;
}

export const IEPS_REPOSITORY = Symbol('IEpsRepository');
