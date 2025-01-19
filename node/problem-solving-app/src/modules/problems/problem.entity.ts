export class Problem {
    // Primary key
    id: number;

    // Column, some not very long text
    title: string;

    // Column, some very long piece of text
    description: string;

    // Column, enum ProblemDifficulty
    difficulty: number;

    // Column, enum ProblemTopic
    // Many to many: one problem may be connected with several topics
    // one topic may be connected to several problems
    topics: Array<number>;

    // One to one: one submission is for only one problem
    submissions: Array<number>;
}
