import { PartialType } from '@nestjs/swagger';
import { CreateProductServiceDto } from './create-product-service.dto';

export class UpdateProductServiceDto extends PartialType(CreateProductServiceDto) { }
