export class Problem {
    // Primary key
    id: number;

    // Column, some not very long text
    title: string;

    // Column, some very long piece of text
    description: string;

    // Column, enum: easy | medium | hard
    difficulty: number;

    // Column, enum of 5-10 topics
    // Many to many: one problem may be connected with several topics
    // one topic may be connected to several problems
    topics: Array<number>;

    // One to one: one submission is for only one problem
    submissions: Array<number>;
}
