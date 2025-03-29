import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Problem } from "./problem.entity";
import { ProgrammingLanguage } from "./problem.submission.lang.entity";

@Entity()
export class Submission {
    @PrimaryGeneratedColumn()
    id: number;

 	@ManyToOne(_type => Problem, problem => problem.submissions)
	problem: Problem;

    @ManyToOne(_type => User, user => user.solutions)
    user: User;

    @Column('boolean')
	correct: boolean;

    @CreateDateColumn({
        type: 'timestamptz',
		precision: 3,
        nullable: false,
    })
	created: Date;

    @ManyToOne(_type => ProgrammingLanguage, lang => lang.submissions)
    lang: ProgrammingLanguage;

    @Column('text')
	content: string;
}
