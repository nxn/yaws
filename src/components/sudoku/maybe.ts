export type Nothing = undefined;
export const Nothing: Nothing = undefined;

export type Maybe<T> = Some<T> | Nothing;

export class Some<T> {
    constructor(
        public value: T
    ) { }
}
