import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Submission } from '../problems/problem.submission.entity';

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

	@OneToMany(
		_type => Submission,
		submission => submission.user,
		{ cascade: ['remove'] }
	)
	solutions: Array<Submission>;

	@Column({
		type: 'timestamptz',
		precision: 3,
		nullable: true,
		default: null,
	})
	lastSeen: Date;
}
