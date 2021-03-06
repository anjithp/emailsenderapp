import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EmailRequestDto {
  /* mail providers are not accepting unverified senders so had to hardcode this to my email for demo. */
  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // from: string;

  @ApiProperty()
  @IsEmail({}, { each: true })
  to: string[];

  @ApiProperty()
  @IsEmail({}, { each: true })
  @IsOptional({ each: true })
  cc?: string[];

  @ApiProperty()
  @IsEmail({}, { each: true })
  @IsOptional({ each: true })
  bcc?: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  textContent: string;
}
