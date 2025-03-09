import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1741530401511 implements MigrationInterface {
    name = 'Init1741530401511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "userName" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(120) NOT NULL, "lastSeen" TIMESTAMP(3) WITH TIME ZONE NOT NULL, CONSTRAINT "UQ_da5934070b5f2726ebfd3122c80" UNIQUE ("userName"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "topic" ("id" SERIAL NOT NULL, "topic" "public"."topic_topic_enum" NOT NULL, CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "problem" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "description" text NOT NULL, "difficulty" "public"."problem_difficulty_enum" NOT NULL, CONSTRAINT "PK_119b5ca6f3371465bf1f0f90219" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "submission" ("id" SERIAL NOT NULL, "correct" boolean NOT NULL, "created" TIMESTAMP(3) WITH TIME ZONE NOT NULL, "lang" "public"."submission_lang_enum" NOT NULL, "content" text NOT NULL, "problemId" integer, "userId" integer, CONSTRAINT "PK_7faa571d0e4a7076e85890c9bd0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "problem_topics_topic" ("problemId" integer NOT NULL, "topicId" integer NOT NULL, CONSTRAINT "PK_57d7a249cc3c9c16adee5746cc7" PRIMARY KEY ("problemId", "topicId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f3f6a308e5221d55105d0f817d" ON "problem_topics_topic" ("problemId") `);
        await queryRunner.query(`CREATE INDEX "IDX_697552e7ad78a911a4315eb3d8" ON "problem_topics_topic" ("topicId") `);
        await queryRunner.query(`ALTER TABLE "submission" ADD CONSTRAINT "FK_3182d5e825aa9dee60559030d49" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submission" ADD CONSTRAINT "FK_7bd626272858ef6464aa2579094" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "problem_topics_topic" ADD CONSTRAINT "FK_f3f6a308e5221d55105d0f817dc" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "problem_topics_topic" ADD CONSTRAINT "FK_697552e7ad78a911a4315eb3d84" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "problem_topics_topic" DROP CONSTRAINT "FK_697552e7ad78a911a4315eb3d84"`);
        await queryRunner.query(`ALTER TABLE "problem_topics_topic" DROP CONSTRAINT "FK_f3f6a308e5221d55105d0f817dc"`);
        await queryRunner.query(`ALTER TABLE "submission" DROP CONSTRAINT "FK_7bd626272858ef6464aa2579094"`);
        await queryRunner.query(`ALTER TABLE "submission" DROP CONSTRAINT "FK_3182d5e825aa9dee60559030d49"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_697552e7ad78a911a4315eb3d8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f3f6a308e5221d55105d0f817d"`);
        await queryRunner.query(`DROP TABLE "problem_topics_topic"`);
        await queryRunner.query(`DROP TABLE "submission"`);
        await queryRunner.query(`DROP TABLE "problem"`);
        await queryRunner.query(`DROP TABLE "topic"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
