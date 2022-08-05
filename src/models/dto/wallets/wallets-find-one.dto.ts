import { IsNotEmpty, IsNumber } from 'class-validator';

export class WalletsFindOneDTO {
  @IsNotEmpty()
  @IsNumber({ allowNaN: false })
  public id: number;
}
