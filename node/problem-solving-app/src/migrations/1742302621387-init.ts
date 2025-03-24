import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1742302621387 implements MigrationInterface {
    name = 'Init1742302621387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."topic_topic_enum" AS ENUM('ARRAY', 'STRING', 'MATH', 'SORTING', 'MATRIX', 'MEMOIZATION')`);
        await queryRunner.query(`CREATE TABLE "topic" ("id" SERIAL NOT NULL, "topic" "public"."topic_topic_enum" NOT NULL, CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."problem_difficulty_difficulty_enum" AS ENUM('EASY', 'MEDIUM', 'HARD')`);
        await queryRunner.query(`CREATE TABLE "problem_difficulty" ("id" SERIAL NOT NULL, "difficulty" "public"."problem_difficulty_difficulty_enum" NOT NULL, CONSTRAINT "PK_0115c9a4dd31e7414a8923151ec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "problem" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "description" text NOT NULL, "difficultyId" integer, CONSTRAINT "PK_119b5ca6f3371465bf1f0f90219" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."programming_language_proglang_enum" AS ENUM('CPP', 'JAVA', 'PYTHON3', 'JAVASCRIPT', 'TYPESCRIPT', 'SWIFT', 'GO')`);
        await queryRunner.query(`CREATE TABLE "programming_language" ("id" SERIAL NOT NULL, "progLang" "public"."programming_language_proglang_enum" NOT NULL, CONSTRAINT "PK_d7bd858452aa2a54b0939d3800e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "submission" ("id" SERIAL NOT NULL, "correct" boolean NOT NULL, "created" TIMESTAMP(3) WITH TIME ZONE NOT NULL, "content" text NOT NULL, "problemId" integer, "userId" integer, "langId" integer, CONSTRAINT "PK_7faa571d0e4a7076e85890c9bd0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "userName" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(120) NOT NULL, "lastSeen" TIMESTAMP(3) WITH TIME ZONE, CONSTRAINT "UQ_da5934070b5f2726ebfd3122c80" UNIQUE ("userName"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "problem_topics_topic" ("problemId" integer NOT NULL, "topicId" integer NOT NULL, CONSTRAINT "PK_57d7a249cc3c9c16adee5746cc7" PRIMARY KEY ("problemId", "topicId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f3f6a308e5221d55105d0f817d" ON "problem_topics_topic" ("problemId") `);
        await queryRunner.query(`CREATE INDEX "IDX_697552e7ad78a911a4315eb3d8" ON "problem_topics_topic" ("topicId") `);
        await queryRunner.query(`ALTER TABLE "problem" ADD CONSTRAINT "FK_7151b8453ff3e47be2b3902730f" FOREIGN KEY ("difficultyId") REFERENCES "problem_difficulty"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submission" ADD CONSTRAINT "FK_3182d5e825aa9dee60559030d49" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submission" ADD CONSTRAINT "FK_7bd626272858ef6464aa2579094" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submission" ADD CONSTRAINT "FK_73eaf226b3e470f6b33afb89887" FOREIGN KEY ("langId") REFERENCES "programming_language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "problem_topics_topic" ADD CONSTRAINT "FK_f3f6a308e5221d55105d0f817dc" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "problem_topics_topic" ADD CONSTRAINT "FK_697552e7ad78a911a4315eb3d84" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problem_topics_topic" DROP CONSTRAINT "FK_697552e7ad78a911a4315eb3d84"`);
        await queryRunner.query(`ALTER TABLE "problem_topics_topic" DROP CONSTRAINT "FK_f3f6a308e5221d55105d0f817dc"`);
        await queryRunner.query(`ALTER TABLE "submission" DROP CONSTRAINT "FK_73eaf226b3e470f6b33afb89887"`);
        await queryRunner.query(`ALTER TABLE "submission" DROP CONSTRAINT "FK_7bd626272858ef6464aa2579094"`);
        await queryRunner.query(`ALTER TABLE "submission" DROP CONSTRAINT "FK_3182d5e825aa9dee60559030d49"`);
        await queryRunner.query(`ALTER TABLE "problem" DROP CONSTRAINT "FK_7151b8453ff3e47be2b3902730f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_697552e7ad78a911a4315eb3d8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f3f6a308e5221d55105d0f817d"`);
        await queryRunner.query(`DROP TABLE "problem_topics_topic"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "submission"`);
        await queryRunner.query(`DROP TABLE "programming_language"`);
        await queryRunner.query(`DROP TYPE "public"."programming_language_proglang_enum"`);
        await queryRunner.query(`DROP TABLE "problem"`);
        await queryRunner.query(`DROP TABLE "problem_difficulty"`);
        await queryRunner.query(`DROP TYPE "public"."problem_difficulty_difficulty_enum"`);
        await queryRunner.query(`DROP TABLE "topic"`);
        await queryRunner.query(`DROP TYPE "public"."topic_topic_enum"`);
    }

}
