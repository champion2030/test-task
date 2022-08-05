import {
  Body,
  Delete,
  Get,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Put,
} from 'routing-controllers';
import { validateDTO } from './common';
import { WalletsFindOneDTO } from '../models/dto/wallets/wallets-find-one.dto';
import { WalletsCreateDTO } from '../models/dto/wallets/wallets-create.dto';
import { WalletsUpdateDTO } from '../models/dto/wallets/wallets-update.dto';
import { WalletsDeleteDTO } from '../models/dto/wallets/wallets-delete.dto';
import { WalletsService } from '../services/wallets.service';

@JsonController('/wallets')
export class WalletsController {
  constructor(private walletService: WalletsService) {}

  @Post('/create')
  public async createWallet(@Body() walletCreateDTO: WalletsCreateDTO) {
    await validateDTO(walletCreateDTO);

    return this.walletService.create(walletCreateDTO);
  }

  @Post('/generate')
  public async generateWallet() {
    return this.walletService.generate();
  }

  @Get('/:id')
  public async getWallet(@Param('id') id: number) {
    const findOneDTO = new WalletsFindOneDTO();

    findOneDTO.id = id;
    await validateDTO(findOneDTO);

    return this.walletService.getBalance(findOneDTO);
  }

  @Put('/update/:id')
  public async updateWallet(@Param('id') id: number, @Body() walletUpdateDTO: WalletsUpdateDTO) {
    walletUpdateDTO.id = id;
    await validateDTO(walletUpdateDTO);

    return this.walletService.update(walletUpdateDTO);
  }

  @Delete('/:id')
  @OnUndefined(204)
  public async deleteWallet(@Param('id') id: number) {
    const deleteDTO = new WalletsDeleteDTO();

    deleteDTO.id = id;
    await validateDTO(deleteDTO);

    return this.walletService.delete(deleteDTO);
  }
}
