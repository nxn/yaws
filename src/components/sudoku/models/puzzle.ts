import type { IGenerateRequestData as IPuzzleSettings } from '@components/contracts/sudokuprovider';

export interface IPuzzleInfo {
    storageId?:     number,

    name:           string;
    created:        number;
    modified?:      number;

    difficulty?:    number;
    solution?:      Uint8Array;
    settings?:      IPuzzleSettings;
}

export interface IPuzzle {
    getName:        () => string;
    getDifficulty:  () => string;
    getCreated:     () => Date;
    getModified:    () => Date;
    getSolution:    () => Uint8Array;

    info:           (info?: IPuzzleInfo) => IPuzzleInfo;
}

export class Puzzle implements IPuzzle {
    private storageId:  number          = null;
    private name:       string          = "Unknown Puzzle";
    private difficulty: number          = null;
    private created:    Date            = new Date();
    private modified:   Date            = null;
    private solution:   Uint8Array      = null;
    private settings:   IPuzzleSettings = null;

    private constructor() { }

    static create() {
        return new Puzzle();
    }

    getDifficulty() {
        if (!this.difficulty) { return null; }

        if (this.difficulty >= 1000) {
            return "Really Hard";
        }
    
        if (this.difficulty >= 300) {
            return "Hard";
        }
    
        if (this.difficulty >= 100) {
            return "Medium";
        }
    
        return "Easy";
    }

    getName() {
        return this.name;
    }

    getCreated() {
        return this.created;
    }

    getModified() {
        return this.modified;
    }

    getSolution() {
        return this.solution;
    }

    getSettings() {
        return this.settings;
    }

    info(info?: IPuzzleInfo) {
        if (info) {
            if (info.storageId)     this.storageId  = info.storageId;
            if (info.name)          this.name       = info.name;
            if (info.created)       this.created    = new Date(info.created);
            if (info.modified)      this.modified   = new Date(info.modified);
            if (info.difficulty)    this.difficulty = info.difficulty;
            if (info.solution)      this.solution   = info.solution;
            if (info.settings)      this.settings   = { ...info.settings };
        }

        return {
            storageId:  this.storageId,
            name:       this.name,
            created:    this.created.getTime(),
            modified:   this.modified && this.modified.getTime(),
        
            difficulty: this.difficulty,
            solution:   this.solution,
            settings:   this.settings
        }
    }
}