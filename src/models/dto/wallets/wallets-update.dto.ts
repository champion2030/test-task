import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class WalletsUpdateDTO {
  @IsNotEmpty()
  @IsNumber({ allowNaN: false })
  public id: number;

  @IsNotEmpty()
  @IsString()
  public address: string;
}
