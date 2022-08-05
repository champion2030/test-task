import { Service } from 'typedi';
import { EntityManager } from 'typeorm';
import { WalletsFindOneDTO } from '../models/dto/wallets/wallets-find-one.dto';
import { WalletEntity } from '../models/entities/wallet.entity';
import { WalletsCreateDTO } from '../models/dto/wallets/wallets-create.dto';
import { IWallet } from '../models/interfaces/wallet.interface';
import { WalletsUpdateDTO } from '../models/dto/wallets/wallets-update.dto';
import { WalletsDeleteDTO } from '../models/dto/wallets/wallets-delete.dto';
import Web3 from 'web3';
import { config } from '../config';
import { Wallet } from 'ethers';
import { IGetBalance } from '../models/interfaces/get-balance.interface';

@Service()
export class WalletsRepository {
  constructor(private web3: Web3) {}

  public async getBalance(
    wallet: WalletsFindOneDTO,
    transaction: EntityManager,
  ): Promise<IGetBalance> {
    const { address }: IWallet = await this.findOne({ id: wallet.id }, transaction);

    try {
      this.web3 = new Web3(config.web3ProviderUrl);

      const balance: string = await this.web3.eth.getBalance(address);

      return {
        address,
        ethBalance: Number(this.web3.utils.fromWei(balance, 'ether')),
        tetherBalance: Number(this.web3.utils.fromWei(balance, 'tether')),
      };
    } catch (error) {
      return error;
    }
  }

  public async findOne(wallet: WalletsFindOneDTO, transaction: EntityManager): Promise<IWallet> {
    const queryBuilder = transaction
      .createQueryBuilder(WalletEntity, 'wallet')
      .select('wallet.id', 'id')
      .addSelect('wallet.address', 'address')
      .where('wallet.id = :id', { id: wallet.id });

    return queryBuilder.getRawOne();
  }

  public async create(wallet: WalletsCreateDTO, transaction: EntityManager): Promise<void>;
  public async create(
    wallet: WalletsCreateDTO,
    transaction: EntityManager,
    options: { returnEntity: true },
  ): Promise<IWallet>;
  public async create(
    wallet: WalletsCreateDTO,
    transaction: EntityManager,
    options?: { returnEntity: true },
  ): Promise<IWallet | void> {
    const createdWallet: IWallet = await transaction.getRepository(WalletEntity).save(wallet);

    if (options && options.returnEntity) {
      return createdWallet;
    }
  }

  public async update(wallet: WalletsUpdateDTO, transaction: EntityManager): Promise<void>;
  public async update(
    wallet: WalletsUpdateDTO,
    transaction: EntityManager,
    options: { returnEntity: true },
  ): Promise<IWallet>;
  public async update(
    wallet: WalletsUpdateDTO,
    transaction: EntityManager,
    options?: { returnEntity: true },
  ): Promise<IWallet | void> {
    await transaction.getRepository(WalletEntity).update({ id: wallet.id }, wallet);

    if (options && options.returnEntity) {
      return this.findOne({ id: wallet.id }, transaction);
    }
  }

  public async generate(wallet: Wallet, transaction: EntityManager): Promise<void>;
  public async generate(
    wallet: Wallet,
    transaction: EntityManager,
    options: { returnEntity: true },
  ): Promise<IWallet>;
  public async generate(
    wallet: Wallet,
    transaction: EntityManager,
    options?: { returnEntity: true },
  ): Promise<IWallet | void> {
    const createdWallet: IWallet = await transaction
      .getRepository(WalletEntity)
      .save({ address: wallet.address });

    if (options && options.returnEntity) {
      return createdWallet;
    }
  }

  public async delete(options: WalletsDeleteDTO, transaction: EntityManager): Promise<void> {
    await transaction.getRepository(WalletEntity).delete({ id: options.id });
  }
}
