self["webpackChunk"]([0],{

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if (!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./src/lib/waffle-iron sync recursive":
/*!**********************************!*\
  !*** ./src/lib/waffle-iron sync ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./src/lib/waffle-iron sync recursive";

/***/ }),

/***/ "./src/lib/waffle-iron/waffle_iron.js":
/*!********************************************!*\
  !*** ./src/lib/waffle-iron/waffle_iron.js ***!
  \********************************************/
/*! exports provided: generate, solve, GeneratorConfig, GeneratorOutput, SolutionRecord, SolverConfig, SolverOutput, __wbindgen_string_new, __wbg_solutionrecord_new, __wbindgen_object_drop_ref, __wbg_getRandomValues_f5e14ab7ac8e995d, __wbg_randomFillSync_d5bd2d655fdf256a, __wbg_self_1b7a39e3a92c949c, __wbg_require_604837428532a733, __wbg_crypto_968f1772287e2df0, __wbindgen_is_undefined, __wbg_getRandomValues_a3d34b4fee3c2869, __wbindgen_throw, __wbindgen_rethrow */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./waffle_iron_bg.wasm */ "./src/lib/waffle-iron/waffle_iron_bg.wasm");
/* harmony import */ var _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./waffle_iron_bg.js */ "./src/lib/waffle-iron/waffle_iron_bg.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "generate", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["generate"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "solve", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["solve"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GeneratorConfig", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["GeneratorConfig"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GeneratorOutput", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["GeneratorOutput"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SolutionRecord", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["SolutionRecord"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SolverConfig", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["SolverConfig"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SolverOutput", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["SolverOutput"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "__wbindgen_string_new", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["__wbindgen_string_new"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "__wbg_solutionrecord_new", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["__wbg_solutionrecord_new"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "__wbindgen_object_drop_ref", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["__wbindgen_object_drop_ref"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "__wbg_getRandomValues_f5e14ab7ac8e995d", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["__wbg_getRandomValues_f5e14ab7ac8e995d"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "__wbg_randomFillSync_d5bd2d655fdf256a", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["__wbg_randomFillSync_d5bd2d655fdf256a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "__wbg_self_1b7a39e3a92c949c", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["__wbg_self_1b7a39e3a92c949c"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "__wbg_require_604837428532a733", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["__wbg_require_604837428532a733"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "__wbg_crypto_968f1772287e2df0", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["__wbg_crypto_968f1772287e2df0"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "__wbindgen_is_undefined", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["__wbindgen_is_undefined"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "__wbg_getRandomValues_a3d34b4fee3c2869", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["__wbg_getRandomValues_a3d34b4fee3c2869"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "__wbindgen_throw", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["__wbindgen_throw"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "__wbindgen_rethrow", function() { return _waffle_iron_bg_js__WEBPACK_IMPORTED_MODULE_1__["__wbindgen_rethrow"]; });




/***/ }),

/***/ "./src/lib/waffle-iron/waffle_iron_bg.js":
/*!***********************************************!*\
  !*** ./src/lib/waffle-iron/waffle_iron_bg.js ***!
  \***********************************************/
/*! exports provided: generate, solve, GeneratorConfig, GeneratorOutput, SolutionRecord, SolverConfig, SolverOutput, __wbindgen_string_new, __wbg_solutionrecord_new, __wbindgen_object_drop_ref, __wbg_getRandomValues_f5e14ab7ac8e995d, __wbg_randomFillSync_d5bd2d655fdf256a, __wbg_self_1b7a39e3a92c949c, __wbg_require_604837428532a733, __wbg_crypto_968f1772287e2df0, __wbindgen_is_undefined, __wbg_getRandomValues_a3d34b4fee3c2869, __wbindgen_throw, __wbindgen_rethrow */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generate", function() { return generate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "solve", function() { return solve; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GeneratorConfig", function() { return GeneratorConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GeneratorOutput", function() { return GeneratorOutput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SolutionRecord", function() { return SolutionRecord; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SolverConfig", function() { return SolverConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SolverOutput", function() { return SolverOutput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__wbindgen_string_new", function() { return __wbindgen_string_new; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__wbg_solutionrecord_new", function() { return __wbg_solutionrecord_new; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__wbindgen_object_drop_ref", function() { return __wbindgen_object_drop_ref; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__wbg_getRandomValues_f5e14ab7ac8e995d", function() { return __wbg_getRandomValues_f5e14ab7ac8e995d; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__wbg_randomFillSync_d5bd2d655fdf256a", function() { return __wbg_randomFillSync_d5bd2d655fdf256a; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__wbg_self_1b7a39e3a92c949c", function() { return __wbg_self_1b7a39e3a92c949c; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__wbg_require_604837428532a733", function() { return __wbg_require_604837428532a733; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__wbg_crypto_968f1772287e2df0", function() { return __wbg_crypto_968f1772287e2df0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__wbindgen_is_undefined", function() { return __wbindgen_is_undefined; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__wbg_getRandomValues_a3d34b4fee3c2869", function() { return __wbg_getRandomValues_a3d34b4fee3c2869; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__wbindgen_throw", function() { return __wbindgen_throw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__wbindgen_rethrow", function() { return __wbindgen_rethrow; });
/* harmony import */ var _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./waffle_iron_bg.wasm */ "./src/lib/waffle-iron/waffle_iron_bg.wasm");


const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["memory"].buffer) {
        cachegetUint8Memory0 = new Uint8Array(_waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["memory"].buffer);
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
function generate(config) {
    let ptr0 = 0;
    if (!isLikeNone(config)) {
        _assertClass(config, GeneratorConfig);
        ptr0 = config.ptr;
        config.ptr = 0;
    }
    var ret = _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["generate"](ptr0);
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
function solve(puzzle, config) {
    var ptr0 = passArray8ToWasm0(puzzle, _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_malloc"]);
    var len0 = WASM_VECTOR_LEN;
    let ptr1 = 0;
    if (!isLikeNone(config)) {
        _assertClass(config, SolverConfig);
        ptr1 = config.ptr;
        config.ptr = 0;
    }
    var ret = _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["solve"](ptr0, len0, ptr1);
    return SolverOutput.__wrap(ret);
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["memory"].buffer) {
        cachegetInt32Memory0 = new Int32Array(_waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["memory"].buffer);
    }
    return cachegetInt32Memory0;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["memory"].buffer) {
        cachegetUint32Memory0 = new Uint32Array(_waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["memory"].buffer);
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
            _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_exn_store"](addHeapObject(e));
        }
    };
}
/**
*/
class GeneratorConfig {

    static __wrap(ptr) {
        const obj = Object.create(GeneratorConfig.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbg_generatorconfig_free"](ptr);
    }
    /**
    * @returns {number}
    */
    get samples() {
        var ret = _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbg_get_generatorconfig_samples"](this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set samples(arg0) {
        _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbg_set_generatorconfig_samples"](this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get iterations() {
        var ret = _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbg_get_generatorconfig_iterations"](this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set iterations(arg0) {
        _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbg_set_generatorconfig_iterations"](this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get removals() {
        var ret = _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbg_get_generatorconfig_removals"](this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set removals(arg0) {
        _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbg_set_generatorconfig_removals"](this.ptr, arg0);
    }
    /**
    */
    constructor() {
        var ret = _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["generatorconfig_new"]();
        return GeneratorConfig.__wrap(ret);
    }
}
/**
*/
class GeneratorOutput {

    static __wrap(ptr) {
        const obj = Object.create(GeneratorOutput.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbg_generatoroutput_free"](ptr);
    }
    /**
    * @returns {Uint8Array}
    */
    get puzzle() {
        try {
            const retptr = _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_export_1"].value - 16;
            _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_export_1"].value = retptr;
            _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["generatoroutput_puzzle"](retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_free"](r0, r1 * 1);
            return v0;
        } finally {
            _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_export_1"].value += 16;
        }
    }
    /**
    * @returns {Uint8Array}
    */
    get solution() {
        try {
            const retptr = _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_export_1"].value - 16;
            _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_export_1"].value = retptr;
            _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["generatoroutput_solution"](retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_free"](r0, r1 * 1);
            return v0;
        } finally {
            _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_export_1"].value += 16;
        }
    }
    /**
    * @returns {number}
    */
    get difficulty() {
        var ret = _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbg_get_solverconfig_limit"](this.ptr);
        return ret >>> 0;
    }
}
/**
*/
class SolutionRecord {

    static __wrap(ptr) {
        const obj = Object.create(SolutionRecord.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbg_solutionrecord_free"](ptr);
    }
    /**
    * @returns {number}
    */
    get iteration() {
        var ret = _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbg_get_solverconfig_limit"](this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get branches() {
        var ret = _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["solutionrecord_branches"](this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {Uint8Array}
    */
    get solution() {
        try {
            const retptr = _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_export_1"].value - 16;
            _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_export_1"].value = retptr;
            _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["solutionrecord_solution"](retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_free"](r0, r1 * 1);
            return v0;
        } finally {
            _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_export_1"].value += 16;
        }
    }
}
/**
*/
class SolverConfig {

    static __wrap(ptr) {
        const obj = Object.create(SolverConfig.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbg_solverconfig_free"](ptr);
    }
    /**
    * @returns {number}
    */
    get limit() {
        var ret = _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbg_get_solverconfig_limit"](this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set limit(arg0) {
        _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbg_set_solverconfig_limit"](this.ptr, arg0);
    }
    /**
    */
    constructor() {
        var ret = _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["solverconfig_new"]();
        return SolverConfig.__wrap(ret);
    }
}
/**
*/
class SolverOutput {

    static __wrap(ptr) {
        const obj = Object.create(SolverOutput.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbg_solveroutput_free"](ptr);
    }
    /**
    * @returns {number}
    */
    get steps() {
        var ret = _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbg_get_solverconfig_limit"](this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    get iterations() {
        var ret = _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["solutionrecord_branches"](this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {any[]}
    */
    get result() {
        try {
            const retptr = _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_export_1"].value - 16;
            _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_export_1"].value = retptr;
            _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["solveroutput_result"](retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayJsValueFromWasm0(r0, r1).slice();
            _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_free"](r0, r1 * 4);
            return v0;
        } finally {
            _waffle_iron_bg_wasm__WEBPACK_IMPORTED_MODULE_0__["__wbindgen_export_1"].value += 16;
        }
    }
}

const __wbindgen_string_new = function(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

const __wbg_solutionrecord_new = function(arg0) {
    var ret = SolutionRecord.__wrap(arg0);
    return addHeapObject(ret);
};

const __wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

const __wbg_getRandomValues_f5e14ab7ac8e995d = function(arg0, arg1, arg2) {
    getObject(arg0).getRandomValues(getArrayU8FromWasm0(arg1, arg2));
};

const __wbg_randomFillSync_d5bd2d655fdf256a = function(arg0, arg1, arg2) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
};

const __wbg_self_1b7a39e3a92c949c = handleError(function() {
    var ret = self.self;
    return addHeapObject(ret);
});

const __wbg_require_604837428532a733 = function(arg0, arg1) {
    var ret = __webpack_require__("./src/lib/waffle-iron sync recursive")(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

const __wbg_crypto_968f1772287e2df0 = function(arg0) {
    var ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

const __wbindgen_is_undefined = function(arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
};

const __wbg_getRandomValues_a3d34b4fee3c2869 = function(arg0) {
    var ret = getObject(arg0).getRandomValues;
    return addHeapObject(ret);
};

const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

const __wbindgen_rethrow = function(arg0) {
    throw takeObject(arg0);
};


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/lib/waffle-iron/waffle_iron_bg.wasm":
/*!*************************************************!*\
  !*** ./src/lib/waffle-iron/waffle_iron_bg.wasm ***!
  \*************************************************/
/*! exports provided: memory, generate, solve, __wbg_get_solverconfig_limit, __wbg_set_solverconfig_limit, solverconfig_new, __wbg_generatorconfig_free, __wbg_get_generatorconfig_samples, __wbg_set_generatorconfig_samples, __wbg_get_generatorconfig_iterations, __wbg_set_generatorconfig_iterations, __wbg_get_generatorconfig_removals, __wbg_set_generatorconfig_removals, generatorconfig_new, __wbg_generatoroutput_free, generatoroutput_puzzle, generatoroutput_solution, __wbg_solutionrecord_free, solutionrecord_branches, solutionrecord_solution, __wbg_solveroutput_free, solveroutput_result, __wbg_solverconfig_free, generatoroutput_difficulty, solutionrecord_iteration, solveroutput_steps, solveroutput_iterations, __wbindgen_malloc, __wbindgen_export_1, __wbindgen_free, __wbindgen_exn_store */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Instantiate WebAssembly module
var wasmExports = __webpack_require__.w[module.i];
__webpack_require__.r(exports);
// export exports from WebAssembly module
for(var name in wasmExports) if(name != "__webpack_init__") exports[name] = wasmExports[name];
// exec imports from WebAssembly module (for esm order)
/* harmony import */ var m0 = __webpack_require__(/*! ./waffle_iron_bg.js */ "./src/lib/waffle-iron/waffle_iron_bg.js");


// exec wasm module
wasmExports["__webpack_init__"]()

/***/ })

});
//# sourceMappingURL=0.bundle.worker.js.map