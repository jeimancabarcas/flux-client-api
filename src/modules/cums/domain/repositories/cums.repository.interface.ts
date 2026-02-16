import { Cum } from '../entities/cum.entity';

export const ICUMS_REPOSITORY = 'ICUMS_REPOSITORY';

export interface ICumsRepository {
    saveMany(cums: Cum[]): Promise<void>;
    clear(): Promise<void>;
    search(term: string): Promise<Cum[]>;
}
