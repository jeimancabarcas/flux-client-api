import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateAgreementDto {
    @ApiProperty({ example: 'uuid-del-producto' })
    @IsUUID()
    productServiceId: string;

    @ApiProperty({ example: 'uuid-de-la-prepagada' })
    @IsUUID()
    prepagadaId: string;

    @ApiProperty({ example: 150000 })
    @IsNumber()
    @Min(0)
    patientAmount: number;

    @ApiProperty({ example: 350000 })
    @IsNumber()
    @Min(0)
    entityAmount: number;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
