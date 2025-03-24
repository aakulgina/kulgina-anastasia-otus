import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProblemDifficulty as Difficulty } from "./enum/ProblemDifficulty.enum";
import { Problem } from "./problem.entity";

@Entity()
export class ProblemDifficulty {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: Difficulty,
    })
    difficulty: Difficulty;

    @OneToMany(_type => Problem, problem => problem.difficulty)
    problems: Array<Problem>;
}
