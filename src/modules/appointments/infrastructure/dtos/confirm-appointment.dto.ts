import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class ConfirmAppointmentDto {
    @ApiProperty({ example: ['b13cf46d-6668-4a85-8609-ccafd0463bfe'], required: false })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    itemIds?: string[];

    @ApiProperty({ example: 'CONVENIO', required: false })
    @IsString()
    @IsOptional()
    paymentType?: string;

    @ApiProperty({ example: '419a2b0f-81e5-4fd8-a21c-ebb006868c1c', required: false })
    @IsString()
    @IsOptional()
    prepagadaId?: string;

    @ApiProperty({ example: '546456', required: false })
    @IsString()
    @IsOptional()
    authorizationCode?: string;
}
