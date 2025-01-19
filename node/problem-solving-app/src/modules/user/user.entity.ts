export class User {
    // Primary key
    id: number;

    // Column, unique, user_name for db, min length = 3, max length = 128, text
    userName: string;

    // Column, unique, text, some email validation
    email: string;

    // Column, select false, hash or whatever could make it safe
    password: string;

    // Many to many: one user can solve many tasks, one task can be solved by many users
    solutions: Array<number>;

    // Column, last_seen for db, Date/datetime/timestamp
    lastSeen: Date;
}