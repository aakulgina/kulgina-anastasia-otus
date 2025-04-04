import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Task } from "../tasks/task.entity";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
	id: number;

    @Column({
        type: 'varchar',
        length: 50,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 10,
    })
    color: string;

    @ManyToOne(_type => User, user => user.projects)
    user: User;

    @OneToMany(_type => Task, task => task.project)
    tasks: Array<Task>;
}
