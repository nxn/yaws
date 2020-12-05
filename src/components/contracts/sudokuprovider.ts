export enum Task { Solve, Generate }

export type Request = ISolverRequest | IGeneratorRequest;
export type Response = ISolverResponse | IGeneratorResponse;

export interface ITaskMessage<T> {
    id?:    number;
    task:   Task;
    data:   T;
}

export interface ISolverRequest extends ITaskMessage<ISolveRequestData> {
    task: Task.Solve;
}
export interface ISolverResponse extends ITaskMessage<ISolveResponseData> {
    task: Task.Solve;
}
export interface IGeneratorRequest extends ITaskMessage<IGenerateRequestData> {
    task: Task.Generate;
}
export interface IGeneratorResponse extends ITaskMessage<IGenerateResponseData> {
    task: Task.Generate;
}

export interface ISolveRequestData {
    puzzle: Uint8Array;
    limit?:  number;
}
export interface ISolveResponseData {
    steps:      number;
    iterations: number;
    result:     ISolutionRecord[];
}
export interface ISolutionRecord {
    iteration:  number;
    branches:   number;
    solution:   Uint8Array;
}

export interface IGenerateRequestData {
    samples:    number;
    iterations: number;
    removals:   number;
}
export interface IGenerateResponseData {
    puzzle:     Uint8Array;
    solution:   Uint8Array;
    difficulty: number;
}

export interface ISudokuProvider {
    generate(request?: IGenerateRequestData): Promise<IGenerateResponseData>;
    solve(request: ISolveRequestData): Promise<ISolveResponseData>;
}