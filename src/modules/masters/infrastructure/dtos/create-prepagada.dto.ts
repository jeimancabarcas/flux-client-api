import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePrepagadaDto {
    @ApiProperty({ example: 'Colmédica' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
