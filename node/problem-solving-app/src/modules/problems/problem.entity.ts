import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Submission } from "./problem.submission.entity";
import { Topic } from "./problem.topic.entity";
import { ProblemDifficulty } from "./problem.difficulty.entity";

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

    @ManyToOne(_type => ProblemDifficulty, difficulty => difficulty.problems)
    difficulty: ProblemDifficulty;

    @ManyToMany(_type => Topic, topic => topic.problems)
    @JoinTable()
    topics: Array<Topic>;

    @OneToMany(_type => Submission, submission => submission.problem)
    submissions: Array<Submission>;
}
