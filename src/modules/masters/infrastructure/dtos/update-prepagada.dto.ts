import { PartialType } from '@nestjs/swagger';
import { CreatePrepagadaDto } from './create-prepagada.dto';

export class UpdatePrepagadaDto extends PartialType(CreatePrepagadaDto) { }
