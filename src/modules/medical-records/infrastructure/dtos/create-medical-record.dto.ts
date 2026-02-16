import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class PediatricExtensionDto {
    @ApiProperty({ example: 15.5 })
    @IsNumber()
    @IsOptional()
    weight?: number;

    @ApiProperty({ example: 105.2 })
    @IsNumber()
    @IsOptional()
    height?: number;

    @ApiProperty({ example: 52.0 })
    @IsNumber()
    @IsOptional()
    cephalicPerimeter?: number;

    @ApiProperty({ example: 60.5 })
    @IsNumber()
    @IsOptional()
    abdominalPerimeter?: number;

    @ApiProperty({ example: 'Parto normal, sin complicaciones.' })
    @IsString()
    @IsOptional()
    perinatalHistory?: string;
}

export class PatientBackgroundDto {
    @ApiProperty({ example: 'Hipertensión arterial', required: false })
    @IsString()
    @IsOptional()
    pathological?: string;

    @ApiProperty({ example: 'Apendicectomía', required: false })
    @IsString()
    @IsOptional()
    surgical?: string;

    @ApiProperty({ example: 'Penicilina', required: false })
    @IsString()
    @IsOptional()
    allergic?: string;

    @ApiProperty({ example: 'Losartán 50mg', required: false })
    @IsString()
    @IsOptional()
    pharmacological?: string;

    @ApiProperty({ example: 'Diabetes tipo 2 en padre', required: false })
    @IsString()
    @IsOptional()
    familyHistory?: string;

    @ApiProperty({ example: 'Cefaleas eventuales', required: false })
    @IsString()
    @IsOptional()
    reviewOfSystems?: string;
}

export class PhysicalExaminationDto {
    @ApiProperty({ example: 'Abdomen blando, doloroso a la palpación...', required: false })
    @IsString()
    @IsOptional()
    content?: string;

    @ApiProperty({ example: 80, required: false })
    @IsNumber()
    @IsOptional()
    heartRate?: number;

    @ApiProperty({ example: 18, required: false })
    @IsNumber()
    @IsOptional()
    respiratoryRate?: number;

    @ApiProperty({ example: 36.5, required: false })
    @IsNumber()
    @IsOptional()
    temperature?: number;

    @ApiProperty({ example: 120, required: false })
    @IsNumber()
    @IsOptional()
    systolicBloodPressure?: number;

    @ApiProperty({ example: 80, required: false })
    @IsNumber()
    @IsOptional()
    diastolicBloodPressure?: number;

    @ApiProperty({ example: 70.5, required: false })
    @IsNumber()
    @IsOptional()
    weight?: number;

    @ApiProperty({ example: 170, required: false })
    @IsNumber()
    @IsOptional()
    height?: number;
}

export class DiagnosisDto {
    @ApiProperty({ example: 'BA41.0' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ example: 'Infarto agudo de miocardio' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 'RELACIONADO' })
    @IsString()
    @IsNotEmpty()
    type: string;
}

export class PrescriptionDto {
    @ApiProperty({ example: '19901234-1' })
    @IsString()
    @IsNotEmpty()
    cum: string;

    @ApiProperty({ example: 'Acetaminofén 500mg' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '500mg' })
    @IsString()
    @IsNotEmpty()
    dosage: string;

    @ApiProperty({ example: 'Cada 8 horas' })
    @IsString()
    @IsNotEmpty()
    frequency: string;

    @ApiProperty({ example: '7 días' })
    @IsString()
    @IsNotEmpty()
    duration: string;

    @ApiProperty({ example: 'Tomar con abundante agua' })
    @IsString()
    @IsOptional()
    instructions?: string;
}

export class CreateMedicalRecordDto {
    @ApiProperty({ example: 'ecf14a2d-8941-4009-85fa-c7d4eb6b54dc' })
    @IsUUID()
    @IsNotEmpty()
    appointmentId: string;

    @ApiProperty({ example: 'ecf14a2d-8941-4009-85fa-c7d4eb6b54dc' })
    @IsUUID()
    @IsNotEmpty()
    patientId: string;

    @ApiProperty({ example: 'Dolor abdominal y fiebre' })
    @IsString()
    @IsNotEmpty()
    reason: string;

    @ApiProperty({ example: 'Paciente refiere dolor desde hace 2 días...' })
    @IsString()
    @IsNotEmpty()
    currentIllness: string;

    @ApiProperty({ type: PhysicalExaminationDto, required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => PhysicalExaminationDto)
    physicalExamination?: PhysicalExaminationDto;

    @ApiProperty({ type: [DiagnosisDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DiagnosisDto)
    diagnoses: DiagnosisDto[];

    @ApiProperty({ type: [PrescriptionDto], required: false })
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => PrescriptionDto)
    prescriptions?: PrescriptionDto[];

    @ApiProperty({ example: 'Iniciar tratamiento con analgésicos...' })
    @IsString()
    @IsNotEmpty()
    plan: string;

    @ApiProperty({ type: PediatricExtensionDto, required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => PediatricExtensionDto)
    pediatricExtension?: PediatricExtensionDto;

    @ApiProperty({ type: PatientBackgroundDto, required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => PatientBackgroundDto)
    patientBackground?: PatientBackgroundDto;
}
