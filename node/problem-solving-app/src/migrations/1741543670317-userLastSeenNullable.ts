import { MigrationInterface, QueryRunner } from "typeorm";

export class UserLastSeenNullable1741543670317 implements MigrationInterface {
    name = 'UserLastSeenNullable1741543670317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastSeen" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastSeen" SET NOT NULL`);
    }

}
