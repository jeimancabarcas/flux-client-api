import { User } from '../../../../domain/entities/user.entity';
import { UserDetails } from '../../../../domain/entities/user-details.entity';
import { UserTypeOrmEntity } from '../entities/user.typeorm-entity';
import { UserDetailsTypeOrmEntity } from '../entities/user-details.typeorm-entity';

export class UserMapper {
    static toDomain(entity: UserTypeOrmEntity): User {
        const details = entity.details
            ? new UserDetails(
                entity.details.id,
                entity.details.cedula,
                entity.details.nombre,
                entity.details.apellido,
                entity.details.direccionPrincipal,
                entity.details.direccionSecundaria,
                entity.details.telefono,
            )
            : null;

        return new User(
            entity.id,
            entity.email,
            entity.password,
            entity.role,
            details,
        );
    }

    static toPersistence(domain: User): UserTypeOrmEntity {
        const entity = new UserTypeOrmEntity();
        if (domain.id) {
            entity.id = domain.id;
        }
        entity.email = domain.email;
        entity.password = domain.password;
        entity.role = domain.role;

        if (domain.details) {
            const detailsEntity = new UserDetailsTypeOrmEntity();
            if (domain.details.id) {
                detailsEntity.id = domain.details.id;
            }
            detailsEntity.cedula = domain.details.cedula;
            detailsEntity.nombre = domain.details.nombre;
            detailsEntity.apellido = domain.details.apellido;
            detailsEntity.direccionPrincipal = domain.details.direccionPrincipal;
            detailsEntity.direccionSecundaria = domain.details.direccionSecundaria;
            detailsEntity.telefono = domain.details.telefono;
            entity.details = detailsEntity;
        }

        return entity;
    }

    static toResponse(user: User) {
        const { password, ...safeUser } = user;
        return safeUser;
    }
}
