/* tslint:disable */
/* eslint-disable */
/**
* @param {GeneratorConfig | undefined} config
* @returns {GeneratorOutput}
*/
export function generate(config?: GeneratorConfig): GeneratorOutput;
/**
* @param {Uint8Array} puzzle
* @param {SolverConfig | undefined} config
* @returns {SolverOutput}
*/
export function solve(puzzle: Uint8Array, config?: SolverConfig): SolverOutput;
/**
*/
export class GeneratorConfig {
  free(): void;
/**
*/
  constructor();
/**
* @returns {number}
*/
  iterations: number;
/**
* @returns {number}
*/
  removals: number;
/**
* @returns {number}
*/
  samples: number;
}
/**
*/
export class GeneratorOutput {
  free(): void;
/**
* @returns {number}
*/
  readonly difficulty: number;
/**
* @returns {Uint8Array}
*/
  readonly puzzle: Uint8Array;
/**
* @returns {Uint8Array}
*/
  readonly solution: Uint8Array;
}
/**
*/
export class SolutionRecord {
  free(): void;
/**
* @returns {number}
*/
  readonly branches: number;
/**
* @returns {number}
*/
  readonly iteration: number;
/**
* @returns {Uint8Array}
*/
  readonly solution: Uint8Array;
}
/**
*/
export class SolverConfig {
  free(): void;
/**
*/
  constructor();
/**
* @returns {number}
*/
  limit: number;
}
/**
*/
export class SolverOutput {
  free(): void;
/**
* @returns {number}
*/
  readonly iterations: number;
/**
* @returns {any[]}
*/
  readonly result: any[];
/**
* @returns {number}
*/
  readonly steps: number;
}
