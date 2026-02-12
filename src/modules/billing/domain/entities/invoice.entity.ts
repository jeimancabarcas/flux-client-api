import { InvoiceStatus } from './invoice-status.enum';
import { InvoiceItem } from './invoice-item.entity';

export class Invoice {
    constructor(
        public readonly id: string | null,
        public readonly appointmentId: string | null,
        public readonly patientId: string,
        public invoiceNumber: string | null,
        public totalAmount: number,
        public status: InvoiceStatus,
        public items: InvoiceItem[] = [],
        public readonly createdAt: Date | null = null,
        public readonly updatedAt: Date | null = null,
    ) { }
}
