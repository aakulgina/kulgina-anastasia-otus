import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProblemTopic } from "./enum/ProblemTopic.enum";
import { Problem } from "./problem.entity";

@Entity()
export class Topic {
    @PrimaryGeneratedColumn()
	id: number;

    @Column({
        type: 'enum',
        enum: ProblemTopic,
    })
    topic: ProblemTopic;

    @ManyToMany(_type => Problem, problem => problem.topics)
    problems: Array<Problem>
}
