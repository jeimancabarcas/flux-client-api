import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IAUDIT_LOG_REPOSITORY, type IAuditLogRepository } from '../../domain/repositories/audit-log.repository.interface';
import { AuditLog } from '../../domain/entities/audit-log.entity';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
    constructor(
        @Inject(IAUDIT_LOG_REPOSITORY)
        private readonly auditRepository: IAuditLogRepository,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, path, ip, body } = request;
        const userAgent = request.get('user-agent') || 'Unknown';
        const user = request.user; // Set by JwtAuthGuard

        return next.handle().pipe(
            tap({
                next: (data) => {
                    const response = context.switchToHttp().getResponse();
                    this.logAction(user, method, path, response.statusCode, ip, userAgent, body);
                },
                error: (err) => {
                    const statusCode = err.status || 500;
                    this.logAction(user, method, path, statusCode, ip, userAgent, body);
                },
            }),
        );
    }

    private async logAction(
        user: any,
        method: string,
        path: string,
        statusCode: number,
        ip: string,
        userAgent: string,
        payload: any,
    ) {
        // Avoid logging passwords or sensitive data in payload
        const safePayload = { ...payload };
        if (safePayload.password) safePayload.password = '**********';

        const auditLog = new AuditLog(
            null,
            user?.id || user?.sub || null,
            user?.email || null,
            path,
            method,
            statusCode,
            ip,
            userAgent,
            new Date(),
            safePayload,
        );

        try {
            await this.auditRepository.save(auditLog);
        } catch (error) {
            console.error('Failed to save audit log:', error);
        }
    }
}
