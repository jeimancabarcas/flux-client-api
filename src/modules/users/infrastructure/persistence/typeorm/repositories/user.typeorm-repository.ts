import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../domain/entities/user.entity';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { UserTypeOrmEntity } from '../entities/user.typeorm-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserTypeOrmEntity)
        private readonly repository: Repository<UserTypeOrmEntity>,
    ) { }

    async create(user: User): Promise<User> {
        const entity = UserMapper.toPersistence(user);
        const savedEntity = await this.repository.save(entity);
        return UserMapper.toDomain(savedEntity);
    }

    async findByEmail(email: string): Promise<User | null> {
        const entity = await this.repository.findOne({ where: { email } });
        return entity ? UserMapper.toDomain(entity) : null;
    }

    async findById(id: string): Promise<User | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? UserMapper.toDomain(entity) : null;
    }

    async findAll(): Promise<User[]> {
        const entities = await this.repository.find();
        return entities.map(UserMapper.toDomain);
    }

    async update(id: string, user: Partial<User>): Promise<User> {
        await this.repository.update(id, user as any);
        const updatedEntity = await this.repository.findOne({ where: { id } });
        if (!updatedEntity) {
            throw new Error('User not found after update');
        }
        return UserMapper.toDomain(updatedEntity);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
