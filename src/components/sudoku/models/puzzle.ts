import { IBoard } from "./board";
import type { IStorageRoot } from "@components/contracts/storageprovider";
import type { ISudokuProvider, IGenerateRequestData as IPuzzleSettings } from "@components/contracts/sudokuprovider";

export interface IPuzzleInfo {
    name:           string;
    created:        Date;
    modified:       Date;

    difficulty?:    number;
    solution?:      Uint8Array;
    settings?:      IPuzzleSettings;
}

export interface IPuzzle {
    getInfo():              IPuzzleInfo
    save():                 void;
    saveAs(name: string):   void;
    share():                string;
}

export interface IPuzzleManager {
    listSaved():                            IPuzzleInfo[];

    open(name: string):                     IPuzzle;
    generate(settings: IPuzzleSettings):    IPuzzle;
    loadLink(link: string):                 IPuzzle;
    import(puzzle: string):                 IPuzzle;

    delete(name: string):                   void;
    rename(name: string, newName: string):  void;
}

export class PuzzleManager implements IPuzzleManager {
    private constructor(
        readonly board:     IBoard, 
        readonly store:     IStorageRoot, 
        readonly provider:  ISudokuProvider
    ) { }

    static create(board: IBoard, store: IStorageRoot, provider: ISudokuProvider): IPuzzleManager {
        return new PuzzleManager(board, store, provider);
    }

    open(name: string): IPuzzle {
        throw new Error("Method not implemented.");
    }

    generate(settings: IPuzzleSettings): IPuzzle {
        throw new Error("Method not implemented.");
    }

    loadLink(link: string): IPuzzle {
        throw new Error("Method not implemented.");
    }

    import(puzzle: string): IPuzzle {
        throw new Error("Method not implemented.");
    }

    listSaved(): IPuzzleInfo[] {
        throw new Error("Method not implemented.");
    }

    delete(name: string): void {
        throw new Error("Method not implemented.");
    }

    rename(name: string, newName: string): void {
        throw new Error("Method not implemented.");
    }
}

class Puzzle implements IPuzzle {
    constructor(
        readonly board: IBoard, 
        readonly store: IStorageRoot, 
        readonly provider: ISudokuProvider
    ) { }

    getInfo(): IPuzzleInfo {
        throw new Error("Method not implemented.");
    }

    save() {
        throw new Error("Method not implemented.");
    }

    saveAs(name: string) {
        throw new Error("Method not implemented.");
    }

    share(): string {
        throw new Error("Method not implemented.");
    }
}
