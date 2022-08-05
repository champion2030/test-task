import { IsNotEmpty, IsString } from 'class-validator';

export class WalletsCreateDTO {
  @IsNotEmpty()
  @IsString()
  public address: string;
}
