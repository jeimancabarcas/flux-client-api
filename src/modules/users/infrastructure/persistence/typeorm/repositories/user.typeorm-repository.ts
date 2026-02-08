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

    async findByEmail(email: string, withDeleted = false): Promise<User | null> {
        const entity = await this.repository.findOne({
            where: { email },
            relations: ['specialties'],
            withDeleted,
        });
        return entity ? UserMapper.toDomain(entity) : null;
    }

    async findById(id: string): Promise<User | null> {
        const entity = await this.repository.findOne({
            where: { id },
            relations: ['specialties']
        });
        return entity ? UserMapper.toDomain(entity) : null;
    }

    async findByCedula(cedula: string, withDeleted = false): Promise<User | null> {
        const entity = await this.repository.findOne({
            where: { details: { cedula } },
            relations: ['specialties'],
            withDeleted,
        });
        return entity ? UserMapper.toDomain(entity) : null;
    }

    async findAll(): Promise<User[]> {
        const entities = await this.repository.find({
            relations: ['specialties']
        });
        return entities.map(UserMapper.toDomain);
    }

    async findByRole(role: string): Promise<User[]> {
        const entities = await this.repository.find({
            where: { role } as any,
            relations: ['specialties']
        });
        return entities.map(UserMapper.toDomain);
    }

    async update(id: string, user: User): Promise<User> {
        const entity = UserMapper.toPersistence(user);
        entity.id = id;
        const updatedEntity = await this.repository.save(entity);
        return UserMapper.toDomain(updatedEntity);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async softDelete(id: string): Promise<void> {
        await this.repository.softDelete(id);
    }
}
