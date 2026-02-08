import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUSER_REPOSITORY, type IUserRepository } from '../../users/domain/repositories/user.repository.interface';
import { LoginDto } from '../infrastructure/dtos/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(IUSER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userRepository.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { email: user.email, sub: user.id, role: user.role };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                detalles: user.details
                    ? {
                        cedula: user.details.cedula,
                        nombre: user.details.nombre,
                        apellido: user.details.apellido,
                        direccionPrincipal: user.details.direccionPrincipal,
                        direccionSecundaria: user.details.direccionSecundaria,
                        telefono: user.details.telefono,
                    }
                    : null,
            },
        };
    }
}
