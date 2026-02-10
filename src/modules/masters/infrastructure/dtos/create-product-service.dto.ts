import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsEnum, IsNumber, Min } from 'class-validator';
import { ProductServiceType } from '../../domain/entities/product-service-type.enum';

export class CreateProductServiceDto {
    @ApiProperty({ example: '890201' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ example: 'Consulta Médica General' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ enum: ProductServiceType, example: ProductServiceType.SERVICE })
    @IsEnum(ProductServiceType)
    type: ProductServiceType;

    @ApiProperty({ example: 120000 })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ example: 50, required: false })
    @IsNumber()
    @IsOptional()
    stock?: number;
}
