import { Service } from 'typedi';
import { EntityManager } from 'typeorm';
import { AllowTransactions, UseTransaction } from './middlewares/transaction.middleware';
import { WalletsFindOneDTO } from '../models/dto/wallets/wallets-find-one.dto';
import { WalletsCreateDTO } from '../models/dto/wallets/wallets-create.dto';
import { IWallet } from '../models/interfaces/wallet.interface';
import { WalletsUpdateDTO } from '../models/dto/wallets/wallets-update.dto';
import { WalletsDeleteDTO } from '../models/dto/wallets/wallets-delete.dto';
import { WalletsRepository } from '../repositories/wallets.repository';
import { ethers, Wallet } from 'ethers';
import { BadRequestError } from 'routing-controllers';
import { IGetBalance } from '../models/interfaces/get-balance.interface';

@Service()
@AllowTransactions
export class WalletsService {
  constructor(private walletsRepository: WalletsRepository) {}

  @UseTransaction()
  public async getBalance(
    options: WalletsFindOneDTO,
    transaction?: EntityManager,
  ): Promise<IGetBalance> {
    const walletToUpdate: IWallet = await this.walletsRepository.findOne(
      { id: options.id },
      transaction,
    );

    if (!walletToUpdate) {
      throw new BadRequestError('Do not have such wallet');
    }

    return this.walletsRepository.getBalance(options, transaction);
  }

  @UseTransaction()
  public async create(options: WalletsCreateDTO, transaction?: EntityManager): Promise<IWallet> {
    return this.walletsRepository.create(options, transaction, { returnEntity: true });
  }

  @UseTransaction()
  public async generate(transaction?: EntityManager): Promise<IWallet> {
    const walletMnemonic: Wallet = ethers.Wallet.createRandom();

    return this.walletsRepository.generate(walletMnemonic, transaction, { returnEntity: true });
  }

  @UseTransaction()
  public async update(options: WalletsUpdateDTO, transaction?: EntityManager): Promise<IWallet> {
    const walletToUpdate: IWallet = await this.walletsRepository.findOne(
      { id: options.id },
      transaction,
    );

    if (!walletToUpdate) {
      throw new BadRequestError('Do not have such wallet');
    }

    return this.walletsRepository.update(options, transaction, { returnEntity: true });
  }

  @UseTransaction()
  public async delete(options: WalletsDeleteDTO, transaction?: EntityManager): Promise<void> {
    const walletToDelete: IWallet = await this.walletsRepository.findOne(
      { id: options.id },
      transaction,
    );

    if (!walletToDelete) {
      throw new BadRequestError('Do not have such wallet');
    }

    await this.walletsRepository.delete(options, transaction);
  }
}
