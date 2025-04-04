import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedEnums1743441244117 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO priority (priority)
            VALUES ('LOW'), ('MEDIUM'), ('HIGH');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM priority
            WHERE priority IN ('LOW', 'MEDIUM', 'HIGH');
        `);
    }

}
