export class Specialty {
    constructor(
        public readonly id: string | null,
        public name: string,
        public description: string | null = null,
    ) { }
}
