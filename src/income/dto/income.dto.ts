import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class IncomeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  details?: string;

  @IsDate()
  @IsOptional()
  date?: Date;

  @IsNumber()
  @IsNotEmpty()
  income_source_id: number;

  @IsNumber()
  @IsOptional()
  created_by?: number;
}

export class UpdateIncomeDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  details?: string;

  @IsDate()
  @IsOptional()
  date?: Date;

  @IsNumber()
  @IsOptional()
  income_source_id?: number;

  @IsNumber()
  @IsOptional()
  created_by?: number;
}
