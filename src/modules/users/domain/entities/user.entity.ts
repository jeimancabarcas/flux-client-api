import { UserRole } from '../../../../common/enums/user-role.enum';
import { UserDetails } from './user-details.entity';

export class User {
    constructor(
        public readonly id: string | null,
        public email: string,
        public password: string,
        public role: UserRole,
        public details: UserDetails | null = null,
        public deletedAt: Date | null = null,
    ) { }
}
