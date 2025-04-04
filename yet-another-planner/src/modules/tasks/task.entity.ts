import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Priority } from "./task.priority.entity";
import { Tag } from "../tags/tag.entity";
import { Project } from "../projects/project.entity";

@Entity()
export class Task {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'varchar',
		length: 150,
	})
	title: string;

	@Column({
		type: 'text',
		nullable: true,
		default: null,
	})
	description: string;

	@ManyToOne(_type => User, user => user.tasks)
	creator: User;

	@ManyToOne(_type => Priority, priority => priority.tasks)
	priority: Priority;

	@ManyToMany(_type => Tag, tag => tag.tasks)
	@JoinTable()
	tags: Array<Tag>;

	@ManyToOne(_type => Project, project => project.tasks)
	project: Project;

	@Column({
		type: 'boolean',
		default: false,
	})
	isCompleted: boolean;

	@Column({
		type: 'timestamptz',
		precision: 3,
		nullable: true,
		default: null,
	})
	plannedDate: Date;
}
