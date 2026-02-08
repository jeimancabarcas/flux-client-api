import { User } from '../../../../domain/entities/user.entity';
import { UserTypeOrmEntity } from '../entities/user.typeorm-entity';

export class UserMapper {
    static toDomain(entity: UserTypeOrmEntity): User {
        return new User(
            entity.id,
            entity.nombre,
            entity.email,
            entity.password,
            entity.role,
        );
    }

    static toPersistence(domain: User): UserTypeOrmEntity {
        const entity = new UserTypeOrmEntity();
        if (domain.id) {
            entity.id = domain.id;
        }
        entity.nombre = domain.nombre;
        entity.email = domain.email;
        entity.password = domain.password;
        entity.role = domain.role;
        return entity;
    }
}
