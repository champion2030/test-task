import { MigrationInterface, QueryRunner } from 'typeorm';

export class createDatabase1659696296980 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `CREATE TABLE "public"."wallets" ("id" SERIAL NOT NULL, "address" character varying NOT NULL, CONSTRAINT "PK_c9437388f3053f1c6d889fcf1d8" PRIMARY KEY ("id"))`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "public"."wallets"`, undefined);
  }
}
