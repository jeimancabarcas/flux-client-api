import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class CreateStandaloneInvoiceItemDto {
    @ApiProperty({ example: '99fa3e21-f0ba-40cb-a158-5f3c2b058f45' })
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty({ example: 1 })
    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateStandaloneInvoiceDto {
    @ApiProperty({ example: 'ecf14a2d-8941-4009-85fa-c7d4eb6b54dc' })
    @IsString()
    @IsNotEmpty()
    patientId: string;

    @ApiProperty({ type: [CreateStandaloneInvoiceItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateStandaloneInvoiceItemDto)
    items: CreateStandaloneInvoiceItemDto[];

    @ApiProperty({ example: 'PARTICULAR', required: false })
    @IsString()
    @IsOptional()
    paymentType?: string;

    @ApiProperty({ example: '419a2b0f-81e5-4fd8-a21c-ebb006868c1c', required: false })
    @IsString()
    @IsOptional()
    prepagadaId?: string;

    @ApiProperty({ example: '12312334', required: false })
    @IsString()
    @IsOptional()
    authorizationCode?: string;

    @ApiProperty({ example: 150000, required: false })
    @IsNumber()
    @IsOptional()
    total?: number;
}
