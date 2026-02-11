export class Agreement {
    constructor(
        public readonly id: string | null,
        public productServiceId: string,
        public prepagadaId: string,
        public patientAmount: number,
        public entityAmount: number,
        public isActive: boolean = true,
        public readonly createdAt: Date | null = null,
        public readonly updatedAt: Date | null = null,
    ) { }

    get totalAmount(): number {
        return this.patientAmount + this.entityAmount;
    }
}
