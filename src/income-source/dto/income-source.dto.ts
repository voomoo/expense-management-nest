import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class IncomeSourceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  source_icon?: string;
}

export class EditIncomeSourceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  source_icon?: string;
}
