import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ExpenseDto {
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
  expense_category_id: number;

  @IsNumber()
  @IsOptional()
  created_by?: number;
}

export class UpdateExpenseDto {
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
  expense_category_id?: number;

  @IsNumber()
  @IsOptional()
  created_by?: number;
}
