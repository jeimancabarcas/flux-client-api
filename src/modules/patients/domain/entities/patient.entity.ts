export class Patient {
    constructor(
        public readonly id: string | null,
        public nombres: string,
        public apellidos: string,
        public tipoIdentificacion: string, // CC, TI, CE, etc.
        public numeroIdentificacion: string,
        public fechaNacimiento: Date,
        public genero: string,
        public email: string | null,
        public telefono: string,
        public direccion: string | null,
        public habeasDataConsent: boolean,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
    ) { }
}
