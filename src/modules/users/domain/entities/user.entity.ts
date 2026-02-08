import { UserRole } from '../../../../common/enums/user-role.enum';

export class User {
    constructor(
        public readonly id: string | null,
        public nombre: string,
        public email: string,
        public password: string,
        public role: UserRole,
    ) { }
}
