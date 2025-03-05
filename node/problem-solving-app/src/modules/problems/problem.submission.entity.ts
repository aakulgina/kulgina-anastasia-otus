import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { ProgLanguage } from "./enum/ProgLanguage.enum";
import { Problem } from "./problem.entity";

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

    @Column({
		type: 'timestamptz',
		precision: 3,
	})
	created: Date;

    @Column({
		type: 'enum',
		enum: ProgLanguage,
	})
    lang: ProgLanguage;

    @Column('text')
	content: string;
}
