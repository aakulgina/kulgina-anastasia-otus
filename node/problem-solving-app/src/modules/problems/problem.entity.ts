import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProblemDifficulty } from "./enum/ProblemDifficulty.enum";
import { Submission } from "./problem.submission.entity";
import { Topic } from "./problem.topic.entity";

@Entity()
export class Problem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 100,
    })
    title: string;

    @Column('text')
    description: string;

    @Column({
        type: 'enum',
        enum: ProblemDifficulty,
    })
    difficulty: ProblemDifficulty;

    @ManyToMany(_type => Topic, topic => topic.problems)
    @JoinTable()
    topics: Array<Topic>;

    @OneToMany(_type => Submission, submission => submission.problem)
    submissions: Array<Submission>;
}
