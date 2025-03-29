import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProgLanguage } from "./enum/ProgLanguage.enum";
import { Submission } from "./problem.submission.entity";

@Entity()
export class ProgrammingLanguage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: ProgLanguage,
    })
    progLang: ProgLanguage;
    
    @OneToMany(_type => Submission, submission => submission.lang)
    submissions: Array<Submission>;
}
