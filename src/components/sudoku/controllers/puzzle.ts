import type { IPuzzle } from '../models/puzzle';
import type { ICellData } from '../models/cell';

export interface IPuzzleDifficulty {

}

type PuzzleData = string | ArrayBuffer | Uint8Array | ICellData;

export interface IPuzzleController {
    generate(puzzle: IPuzzle, difficulty: IPuzzleDifficulty): void;
    open    (puzzle: IPuzzle, data: PuzzleData):              void;
    openLink(puzzle: IPuzzle, link: string):                  void;
    save    (puzzle: IPuzzle, name: string):                  void;
}