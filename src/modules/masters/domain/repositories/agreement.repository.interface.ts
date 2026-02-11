import { Agreement } from '../entities/agreement.entity';

export const IAGREEMENT_REPOSITORY = 'IAGREEMENT_REPOSITORY';

export interface IAgreementRepository {
    save(agreement: Agreement): Promise<Agreement>;
    findById(id: string): Promise<Agreement | null>;
    findByProductAndPrepagada(productServiceId: string, prepagadaId: string): Promise<Agreement | null>;
    findAll(filters?: { prepagadaId?: string; isActive?: boolean }): Promise<Agreement[]>;
    delete(id: string): Promise<void>;
}
