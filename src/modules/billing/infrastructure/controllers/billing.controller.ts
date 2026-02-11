import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { UserRole } from '../../../../common/enums/user-role.enum';
import { Inject } from '@nestjs/common';
import { IINVOICE_REPOSITORY } from '../../domain/repositories/invoice.repository.interface';
import type { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';

@ApiTags('Facturación')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('billing')
export class BillingController {
    constructor(
        @Inject(IINVOICE_REPOSITORY)
        private readonly invoiceRepository: IInvoiceRepository,
    ) { }

    @Get('patient/:id')
    @ApiOperation({ summary: 'Obtener facturas por ID de paciente' })
    async getByPatient(@Param('id') patientId: string) {
        return await this.invoiceRepository.findByPatientId(patientId);
    }

    @Get('appointment/:id')
    @ApiOperation({ summary: 'Obtener factura por ID de cita' })
    async getByAppointment(@Param('id') appointmentId: string) {
        return await this.invoiceRepository.findByAppointmentId(appointmentId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener factura por ID' })
    async getById(@Param('id') id: string) {
        return await this.invoiceRepository.findById(id);
    }
}
