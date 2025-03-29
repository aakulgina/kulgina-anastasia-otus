import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultSubmissionCreationDate1742810376825 implements MigrationInterface {
    name = 'DefaultSubmissionCreationDate1742810376825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "submission" ALTER COLUMN "created" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "submission" ALTER COLUMN "created" DROP DEFAULT`);
    }

}
