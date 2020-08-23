import * as wasm from './waffle_iron_bg.wasm';

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
/**
* @param {GeneratorConfig | undefined} config
* @returns {GeneratorOutput}
*/
export function generate(config) {
    let ptr0 = 0;
    if (!isLikeNone(config)) {
        _assertClass(config, GeneratorConfig);
        ptr0 = config.ptr;
        config.ptr = 0;
    }
    var ret = wasm.generate(ptr0);
    return GeneratorOutput.__wrap(ret);
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {Uint8Array} puzzle
* @param {SolverConfig | undefined} config
* @returns {SolverOutput}
*/
export function solve(puzzle, config) {
    var ptr0 = passArray8ToWasm0(puzzle, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    let ptr1 = 0;
    if (!isLikeNone(config)) {
        _assertClass(config, SolverConfig);
        ptr1 = config.ptr;
        config.ptr = 0;
    }
    var ret = wasm.solve(ptr0, len0, ptr1);
    return SolverOutput.__wrap(ret);
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(takeObject(slice[i]));
    }
    return result;
}

function handleError(f) {
    return function () {
        try {
            return f.apply(this, arguments);

        } catch (e) {
            wasm.__wbindgen_exn_store(addHeapObject(e));
        }
    };
}
/**
*/
export class GeneratorConfig {

    static __wrap(ptr) {
        const obj = Object.create(GeneratorConfig.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_generatorconfig_free(ptr);
    }
    /**
    * @returns {number}
    */
    get samples() {
        var ret = wasm.__wbg_get_generatorconfig_samples(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set samples(arg0) {
        wasm.__wbg_set_generatorconfig_samples(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get iterations() {
        var ret = wasm.__wbg_get_generatorconfig_iterations(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set iterations(arg0) {
        wasm.__wbg_set_generatorconfig_iterations(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get removals() {
        var ret = wasm.__wbg_get_generatorconfig_removals(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set removals(arg0) {
        wasm.__wbg_set_generatorconfig_removals(this.ptr, arg0);
    }
    /**
    */
    constructor() {
        var ret = wasm.generatorconfig_new();
        return GeneratorConfig.__wrap(ret);
    }
}
/**
*/
export class GeneratorOutput {

    static __wrap(ptr) {
        const obj = Object.create(GeneratorOutput.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_generatoroutput_free(ptr);
    }
    /**
    * @returns {Uint8Array}
    */
    get puzzle() {
        try {
            const retptr = wasm.__wbindgen_export_1.value - 16;
            wasm.__wbindgen_export_1.value = retptr;
            wasm.generatoroutput_puzzle(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_export_1.value += 16;
        }
    }
    /**
    * @returns {Uint8Array}
    */
    get solution() {
        try {
            const retptr = wasm.__wbindgen_export_1.value - 16;
            wasm.__wbindgen_export_1.value = retptr;
            wasm.generatoroutput_solution(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_export_1.value += 16;
        }
    }
    /**
    * @returns {number}
    */
    get difficulty() {
        var ret = wasm.__wbg_get_solverconfig_limit(this.ptr);
        return ret >>> 0;
    }
}
/**
*/
export class SolutionRecord {

    static __wrap(ptr) {
        const obj = Object.create(SolutionRecord.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_solutionrecord_free(ptr);
    }
    /**
    * @returns {number}
    */
    get iteration() {
        var ret = wasm.__wbg_get_solverconfig_limit(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get branches() {
        var ret = wasm.solutionrecord_branches(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {Uint8Array}
    */
    get solution() {
        try {
            const retptr = wasm.__wbindgen_export_1.value - 16;
            wasm.__wbindgen_export_1.value = retptr;
            wasm.solutionrecord_solution(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_export_1.value += 16;
        }
    }
}
/**
*/
export class SolverConfig {

    static __wrap(ptr) {
        const obj = Object.create(SolverConfig.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_solverconfig_free(ptr);
    }
    /**
    * @returns {number}
    */
    get limit() {
        var ret = wasm.__wbg_get_solverconfig_limit(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set limit(arg0) {
        wasm.__wbg_set_solverconfig_limit(this.ptr, arg0);
    }
    /**
    */
    constructor() {
        var ret = wasm.solverconfig_new();
        return SolverConfig.__wrap(ret);
    }
}
/**
*/
export class SolverOutput {

    static __wrap(ptr) {
        const obj = Object.create(SolverOutput.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_solveroutput_free(ptr);
    }
    /**
    * @returns {number}
    */
    get steps() {
        var ret = wasm.__wbg_get_solverconfig_limit(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get iterations() {
        var ret = wasm.solutionrecord_branches(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {any[]}
    */
    get result() {
        try {
            const retptr = wasm.__wbindgen_export_1.value - 16;
            wasm.__wbindgen_export_1.value = retptr;
            wasm.solveroutput_result(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v0;
        } finally {
            wasm.__wbindgen_export_1.value += 16;
        }
    }
}

export const __wbindgen_string_new = function(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export const __wbg_solutionrecord_new = function(arg0) {
    var ret = SolutionRecord.__wrap(arg0);
    return addHeapObject(ret);
};

export const __wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

export const __wbg_getRandomValues_f5e14ab7ac8e995d = function(arg0, arg1, arg2) {
    getObject(arg0).getRandomValues(getArrayU8FromWasm0(arg1, arg2));
};

export const __wbg_randomFillSync_d5bd2d655fdf256a = function(arg0, arg1, arg2) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
};

export const __wbg_self_1b7a39e3a92c949c = handleError(function() {
    var ret = self.self;
    return addHeapObject(ret);
});

export const __wbg_require_604837428532a733 = function(arg0, arg1) {
    var ret = require(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export const __wbg_crypto_968f1772287e2df0 = function(arg0) {
    var ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

export const __wbindgen_is_undefined = function(arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
};

export const __wbg_getRandomValues_a3d34b4fee3c2869 = function(arg0) {
    var ret = getObject(arg0).getRandomValues;
    return addHeapObject(ret);
};

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export const __wbindgen_rethrow = function(arg0) {
    throw takeObject(arg0);
};

