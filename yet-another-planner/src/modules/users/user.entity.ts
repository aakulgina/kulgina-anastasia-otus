import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../tasks/task.entity';
import { Tag } from '../tags/tag.entity';
import { Project } from '../projects/project.entity';
import { Settings } from '../settings/settings.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'varchar',
		length: 50,
		unique: true,
	})
	userName: string;

	@Column({
		type: 'varchar',
		length: 100,
		unique: true,
	})
	email: string;

	@Column({
		type: 'varchar',
		length: 120,
	})
	password: string;

	@OneToMany(_type => Task, task => task.creator)
	tasks: Array<Task>;

	@OneToMany(_type => Tag, tag => tag.user)
	tags: Array<Tag>;

	@OneToMany(_type => Project, project => project.user)
	projects: Array<Project>;

	@OneToOne(_type => Settings, settings => settings.user)
	@JoinColumn()
	settings: Settings;
}
