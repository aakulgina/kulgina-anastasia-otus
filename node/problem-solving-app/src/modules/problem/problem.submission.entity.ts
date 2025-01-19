export class Submission {
    // Primary key
    id: number;

    // One to one: one solution may be connected to only one task
    problem: number;

    // One to one: one solution (even not unique) may be sent by only one user
    user: number;

    // Column, boolean, in the solution is correct
    correct: boolean;

    // Column, date/timestamp/whatever indicated when the solution was submitted
    created: Date;

    // Column, enum
    lang: number;

    // Column, some huge text type
    content: string;
}
