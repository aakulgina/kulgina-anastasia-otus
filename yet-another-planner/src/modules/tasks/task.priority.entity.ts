import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Priority as PriorityEnum } from './enums/Priority.enum';
import { Task } from "./task.entity";

@Entity()
export class Priority {
    @PrimaryGeneratedColumn()
	id: number;

    @Column({
        type: 'enum',
        enum: PriorityEnum,
    })
    priority: PriorityEnum;

    @OneToMany(_type => Task, task => task.priority)
    tasks: Array<Task>;
}