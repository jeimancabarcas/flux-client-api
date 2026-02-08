import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseUtil } from '../utils/response.util';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;

        return next.handle().pipe(
            map((data) => {
                // Si ya es una respuesta estandarizada, retornarla tal cual
                if (data && typeof data === 'object' && 'success' in data && 'timestamp' in data) {
                    return data;
                }

                // Determinar el mensaje según el método HTTP
                let message = 'Operación exitosa';

                switch (method) {
                    case 'POST':
                        message = 'Recurso creado exitosamente';
                        break;
                    case 'PUT':
                    case 'PATCH':
                        message = 'Recurso actualizado exitosamente';
                        break;
                    case 'DELETE':
                        message = 'Recurso eliminado exitosamente';
                        break;
                    case 'GET':
                        message = 'Datos obtenidos exitosamente';
                        break;
                }

                return ResponseUtil.success(data, message);
            }),
        );
    }
}
