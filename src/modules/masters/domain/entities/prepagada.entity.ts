export class Prepagada {
    constructor(
        public readonly id: string | null,
        public name: string,
        public isActive: boolean = true,
    ) { }
}
