import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class EmailRequestDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  from: string;

  @ApiProperty()
  @IsEmail({}, { each: true })
  to: string[];

  @ApiProperty()
  @IsEmail({}, { each: true })
  @IsOptional({ each: true })
  cc: string[];

  @ApiProperty()
  @IsEmail({}, { each: true })
  @IsOptional({ each: true })
  bcc: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  textContent: string;
}