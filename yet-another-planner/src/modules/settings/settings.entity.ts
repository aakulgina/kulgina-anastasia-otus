import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Settings {
    @PrimaryGeneratedColumn()
	id: number;

    @OneToOne(_type => User, user => user.settings)
    user: User;

    @Column({
        type: 'enum',
        enum: ['Monday', 'Sunday'],
        default: 'Monday',
    })
    startOfWeek: 'Monday' | 'Sunday';
}
