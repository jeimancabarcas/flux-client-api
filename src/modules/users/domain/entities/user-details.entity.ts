export class UserDetails {
    constructor(
        public readonly id: string | null,
        public cedula: string | null,
        public nombre: string | null,
        public apellido: string | null,
        public direccionPrincipal: string | null,
        public direccionSecundaria: string | null,
        public telefono: string | null,
    ) { }
}
