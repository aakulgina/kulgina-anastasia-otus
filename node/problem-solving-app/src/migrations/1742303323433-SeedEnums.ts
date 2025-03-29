import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedEnums1742303323433 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO problem_difficulty (difficulty)
            VALUES ('EASY'), ('MEDIUM'), ('HARD');
        `);
        await queryRunner.query(`
            INSERT INTO programming_language ("progLang")
            VALUES ('CPP'), ('JAVA'), ('PYTHON3'), ('JAVASCRIPT'), ('TYPESCRIPT'), ('SWIFT'), ('GO');
        `);
        await queryRunner.query(`
            INSERT INTO topic (topic)
            VALUES ('ARRAY'), ('STRING'), ('MATH'), ('SORTING'), ('MATRIX'), ('MEMOIZATION');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM problem_difficulty
            WHERE difficulty IN ('EASY', 'MEDIUM', 'HARD');
        `);
        await queryRunner.query(`
            DELETE FROM programming_language
            WHERE progLang IN ('CPP', 'JAVA', 'PYTHON3', 'JAVASCRIPT', 'TYPESCRIPT', 'SWIFT', 'GO');
        `);
        await queryRunner.query(`
            DELETE FROM topic
            WHERE topic IN ('ARRAY', 'STRING', 'MATH', 'SORTING', 'MATRIX', 'MEMOIZATION');
        `);
    }

}
