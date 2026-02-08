import { AuditLog } from '../entities/audit-log.entity';

export interface IAuditLogRepository {
    save(auditLog: AuditLog): Promise<void>;
}

export const IAUDIT_LOG_REPOSITORY = Symbol('IAuditLogRepository');
