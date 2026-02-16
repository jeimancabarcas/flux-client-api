import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchIcdDto {
    @ApiProperty({ example: 'derma' })
    @IsString()
    @IsNotEmpty()
    q: string;

    @ApiProperty({ example: '2025-01', required: false })
    @IsString()
    @IsOptional()
    releaseId?: string;

    @ApiProperty({ example: 'mms', required: false })
    @IsString()
    @IsOptional()
    linearization?: string;

    @ApiProperty({ example: '10;11;12;V;X;', required: false })
    @IsString()
    @IsOptional()
    chapterFilter?: string;

    @ApiProperty({ example: '', required: false })
    @IsString()
    @IsOptional()
    subtreesFilter?: string;

    @ApiProperty({ example: true, required: false })
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    @IsOptional()
    includePostcoordination?: boolean;

    @ApiProperty({ example: false, required: false })
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    @IsOptional()
    useBroaderSynonyms?: boolean;

    @ApiProperty({ example: false, required: false })
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    @IsOptional()
    useFlexiSearch?: boolean;

    @ApiProperty({ example: true, required: false })
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    @IsOptional()
    includeKeywordResult?: boolean;

    @ApiProperty({ example: true, required: false })
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    @IsOptional()
    flatResults?: boolean;

    @ApiProperty({ example: true, required: false })
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    @IsOptional()
    highlightingEnabled?: boolean;

    @ApiProperty({ example: true, required: false })
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    @IsOptional()
    medicalCodingMode?: boolean;
}
