import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Task } from "../tasks/task.entity";

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
	id: number;

    @Column({
        type: 'varchar',
        length: 50,
    })
    tag: string;

    @Column({
        type: 'varchar',
        length: 10,
    })
    color: string;

    @ManyToOne(_type => User, user => user.tags)
    user: User;

    @ManyToMany(_type => Task, task => task.tags)
    tasks: Array<Task>;
}
