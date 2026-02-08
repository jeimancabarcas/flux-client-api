import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogTypeOrmEntity } from './infrastructure/persistence/typeorm/entities/audit-log.typeorm-entity';
import { IAUDIT_LOG_REPOSITORY } from './domain/repositories/audit-log.repository.interface';
import { AuditLogTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/audit-log.typeorm-repository';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([AuditLogTypeOrmEntity])],
    providers: [
        {
            provide: IAUDIT_LOG_REPOSITORY,
            useClass: AuditLogTypeOrmRepository,
        },
    ],
    exports: [IAUDIT_LOG_REPOSITORY],
})
export class AuditModule { }
