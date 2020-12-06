import type { IGenerateRequestData as IPuzzleSettings } from '@components/contracts/sudokuprovider';

export interface IPuzzleInfo {
    storageId?:     number,

    name:           string;
    created:        number;
    modified:       number;

    difficulty?:    number;
    solution?:      Uint8Array;
    settings?:      IPuzzleSettings;
}

// export class PuzzleInfo implements IPuzzleInfo {
//     storageId?:     number;
//     name:           string;
//     created:        number;
//     modified:       number;
//     difficulty?:    number;
//     solution?:      Uint8Array;
//     settings?:      IPuzzleSettings;
// }