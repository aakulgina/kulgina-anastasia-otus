import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1743441087259 implements MigrationInterface {
    name = 'Init1743441087259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."priority_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH')`);
        await queryRunner.query(`CREATE TABLE "priority" ("id" SERIAL NOT NULL, "priority" "public"."priority_priority_enum" NOT NULL, CONSTRAINT "PK_413921aa4a118e20f361ceba8b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "tag" character varying(50) NOT NULL, "color" character varying(10) NOT NULL, "userId" integer, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "color" character varying(10) NOT NULL, "userId" integer, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "title" character varying(150) NOT NULL, "description" text, "isCompleted" boolean NOT NULL DEFAULT false, "plannedDate" TIMESTAMP(3) WITH TIME ZONE, "creatorId" integer, "priorityId" integer, "projectId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."settings_startofweek_enum" AS ENUM('Monday', 'Sunday')`);
        await queryRunner.query(`CREATE TABLE "settings" ("id" SERIAL NOT NULL, "startOfWeek" "public"."settings_startofweek_enum" NOT NULL DEFAULT 'Monday', CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "userName" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(120) NOT NULL, CONSTRAINT "UQ_da5934070b5f2726ebfd3122c80" UNIQUE ("userName"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_tags_tag" ("taskId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_28bdc8d6452f65a8ae3f4c2ab25" PRIMARY KEY ("taskId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_374509e2164bd1126522f424f6" ON "task_tags_tag" ("taskId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0e31820cdb45be62449b4f69c8" ON "task_tags_tag" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_d0dc39ff83e384b4a097f47d3f5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_94fe6b3a5aec5f85427df4f8cd7" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_9ef9d93f2b4576505432917a0f7" FOREIGN KEY ("priorityId") REFERENCES "priority"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_tags_tag" ADD CONSTRAINT "FK_374509e2164bd1126522f424f6f" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "task_tags_tag" ADD CONSTRAINT "FK_0e31820cdb45be62449b4f69c8c" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_tags_tag" DROP CONSTRAINT "FK_0e31820cdb45be62449b4f69c8c"`);
        await queryRunner.query(`ALTER TABLE "task_tags_tag" DROP CONSTRAINT "FK_374509e2164bd1126522f424f6f"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_9ef9d93f2b4576505432917a0f7"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_94fe6b3a5aec5f85427df4f8cd7"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_d0dc39ff83e384b4a097f47d3f5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0e31820cdb45be62449b4f69c8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_374509e2164bd1126522f424f6"`);
        await queryRunner.query(`DROP TABLE "task_tags_tag"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "settings"`);
        await queryRunner.query(`DROP TYPE "public"."settings_startofweek_enum"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "priority"`);
        await queryRunner.query(`DROP TYPE "public"."priority_priority_enum"`);
    }

}
