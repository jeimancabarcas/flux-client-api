import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'audit_logs', schema: 'fluxmedical' })
export class AuditLogTypeOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', name: 'user_id', nullable: true })
    userId: string | null;

    @Column({ type: 'varchar', nullable: true })
    email: string | null;

    @Column()
    path: string;

    @Column()
    method: string;

    @Column({ type: 'integer', name: 'status_code', nullable: true })
    statusCode: number | null;

    @Column()
    ip: string;

    @Column({ type: 'text' })
    device: string;

    @Column({ type: 'jsonb', nullable: true })
    payload: any;

    @CreateDateColumn({ name: 'timestamp' })
    timestamp: Date;
}
