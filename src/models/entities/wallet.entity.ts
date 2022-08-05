import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Кошельки
 */

@Entity({ name: 'wallets', schema: 'public' })
export class WalletEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column('varchar', {
    comment: 'публичный адрес кошелька в сети Ethereum',
    nullable: false,
    name: 'address',
  })
  public address: string;
}
