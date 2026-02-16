import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IcdService } from './icd.service';
import { IcdController } from './icd.controller';

@Module({
    imports: [HttpModule],
    providers: [IcdService],
    controllers: [IcdController],
    exports: [IcdService],
})
export class IcdModule { }
