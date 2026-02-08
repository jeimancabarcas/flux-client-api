import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAuditLogRepository } from '../../../../domain/repositories/audit-log.repository.interface';
import { AuditLog } from '../../../../domain/entities/audit-log.entity';
import { AuditLogTypeOrmEntity } from '../entities/audit-log.typeorm-entity';

@Injectable()
export class AuditLogTypeOrmRepository implements IAuditLogRepository {
    constructor(
        @InjectRepository(AuditLogTypeOrmEntity)
        private readonly repository: Repository<AuditLogTypeOrmEntity>,
    ) { }

    async save(auditLog: AuditLog): Promise<void> {
        const entity = new AuditLogTypeOrmEntity();
        entity.userId = auditLog.userId;
        entity.email = auditLog.email;
        entity.path = auditLog.path;
        entity.method = auditLog.method;
        entity.statusCode = auditLog.statusCode;
        entity.ip = auditLog.ip;
        entity.device = auditLog.device;
        entity.payload = auditLog.payload;

        await this.repository.save(entity);
    }
}
