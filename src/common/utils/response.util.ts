import { ApiResponse } from '../interfaces/api-response.interface';

export class ResponseUtil {
    static success<T>(data: T, message: string = 'Operación exitosa'): ApiResponse<T> {
        return {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        };
    }

    static error(
        message: string,
        code: string = 'INTERNAL_ERROR',
        details?: any,
    ): ApiResponse {
        return {
            success: false,
            message,
            error: {
                code,
                details,
            },
            timestamp: new Date().toISOString(),
        };
    }

    static created<T>(data: T, message: string = 'Recurso creado exitosamente'): ApiResponse<T> {
        return {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        };
    }

    static updated<T>(data: T, message: string = 'Recurso actualizado exitosamente'): ApiResponse<T> {
        return {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        };
    }

    static deleted(message: string = 'Recurso eliminado exitosamente'): ApiResponse {
        return {
            success: true,
            message,
            timestamp: new Date().toISOString(),
        };
    }
}
