import { Prepagada } from '../entities/prepagada.entity';

export interface IPrepagadaRepository {
    save(prepagada: Prepagada): Promise<Prepagada>;
    findById(id: string): Promise<Prepagada | null>;
    findAll(): Promise<Prepagada[]>;
    delete(id: string): Promise<void>;
}

export const IPREPAGADA_REPOSITORY = Symbol('IPrepagadaRepository');
