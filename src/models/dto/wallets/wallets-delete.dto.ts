import { IsNotEmpty, IsNumber } from 'class-validator';

export class WalletsDeleteDTO {
  @IsNotEmpty()
  @IsNumber({ allowNaN: false })
  public id: number;
}
