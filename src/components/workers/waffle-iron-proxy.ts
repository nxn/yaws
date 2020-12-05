import {
    IGenerateRequestData,
    IGenerateResponseData,
    ISolveRequestData,
    ISolveResponseData,
} from "@components/contracts/sudokuprovider";

type WaffleIron = typeof import("../../lib/waffle-iron/waffle_iron");

// Masks wasm_bindgen behavior by copying data into plain JS objects. Otherwise serializing or transferring wasm_bindgen
// objects over a boundary (such as web-worker -> main thread) ends in a copy of a pointer value and no ability to use 
// it. Wasm_bindgen also tends to free itself of ownership of data immediately after it is accessed, so copying
// everything in one go is probably less error prone than passing around a partially freed object.
export class WaffleIronProxy {
    constructor(private module: WaffleIron) { }

    public generate(data?: IGenerateRequestData): IGenerateResponseData {
        let config = undefined;
        if (data) {
            config = new this.module.GeneratorConfig();
            config.samples      = data.samples;
            config.iterations   = data.iterations;
            config.removals     = data.removals;
        }
    
        const output = this.module.generate(config);
        return {
            difficulty: output.difficulty,
            puzzle:     output.puzzle,
            solution:   output.solution,
        };
    }
    
    public solve(data: ISolveRequestData): ISolveResponseData {
        let config = undefined;
    
        if (data.limit !== undefined) {
            config = new this.module.SolverConfig();
            config.limit = data.limit;
        }
    
        const output = this.module.solve(data.puzzle, config);
        return {
            iterations: output.iterations,
            steps: output.steps,
            result: output.result.map(r => ({
                iteration: r.iteration,
                branches: r.branches,
                solution: r.solution
            }))
        };
    }
}

