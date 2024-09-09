import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ArrayMinSize(1)
  ingredients: string[];

  @IsArray()
  @ArrayMinSize(1)
  steps: string[];

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  categoryId: string;
}
