import { ResponsibilityStatus } from './responsibility-status.enum';

export class InvoiceItem {
    constructor(
        public readonly id: string | null,
        public readonly invoiceId: string | null,
        public productServiceId: string,
        public description: string,
        public quantity: number,
        public unitPrice: number,
        public patientAmount: number,
        public patientStatus: ResponsibilityStatus,
        public entityAmount: number,
        public entityStatus: ResponsibilityStatus,
        public totalAmount: number,
        public convenioId: string | null = null,
    ) { }
}
