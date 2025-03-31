import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUserSettingsRelation1743442035585 implements MigrationInterface {
    name = 'FixUserSettingsRelation1743442035585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "settingsId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_390395c3d8592e3e8d8422ce853" UNIQUE ("settingsId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_390395c3d8592e3e8d8422ce853" FOREIGN KEY ("settingsId") REFERENCES "settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_390395c3d8592e3e8d8422ce853"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_390395c3d8592e3e8d8422ce853"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "settingsId"`);
    }

}
