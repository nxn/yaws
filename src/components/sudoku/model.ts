import type { IEventStore } from './events';

export type ModelType = "Board" | "Cell" | "Candidate";
export const ModelType = {
    get Board(): ModelType      { return "Board"; },
    get Cell(): ModelType       { return "Cell"; },
    get Candidate(): ModelType  { return "Candidate"; }
}

export interface IModel {
    type:   ModelType;
    events: IEventStore;
}
