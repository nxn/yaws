/******/ (function(modules) { // webpackBootstrap
/******/ 	self["webpackChunk"] = function webpackChunkCallback(chunkIds, moreModules) {
/******/ 		for(var moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		while(chunkIds.length)
/******/ 			installedChunks[chunkIds.pop()] = 1;
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded chunks
/******/ 	// "1" means "already loaded"
/******/ 	var installedChunks = {
/******/ 		"waffle-iron-worker": 1
/******/ 	};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	function promiseResolve() { return Promise.resolve(); }
/******/
/******/ 	var wasmImportObjects = {
/******/ 		"./src/lib/waffle-iron/waffle_iron_bg.wasm": function() {
/******/ 			return {
/******/ 				"./waffle_iron_bg.js": {
/******/ 					"__wbindgen_string_new": function(p0i32,p1i32) {
/******/ 						return installedModules["./src/lib/waffle-iron/waffle_iron_bg.js"].exports["__wbindgen_string_new"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_solutionrecord_new": function(p0i32) {
/******/ 						return installedModules["./src/lib/waffle-iron/waffle_iron_bg.js"].exports["__wbg_solutionrecord_new"](p0i32);
/******/ 					},
/******/ 					"__wbindgen_object_drop_ref": function(p0i32) {
/******/ 						return installedModules["./src/lib/waffle-iron/waffle_iron_bg.js"].exports["__wbindgen_object_drop_ref"](p0i32);
/******/ 					},
/******/ 					"__wbg_getRandomValues_f5e14ab7ac8e995d": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["./src/lib/waffle-iron/waffle_iron_bg.js"].exports["__wbg_getRandomValues_f5e14ab7ac8e995d"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbg_randomFillSync_d5bd2d655fdf256a": function(p0i32,p1i32,p2i32) {
/******/ 						return installedModules["./src/lib/waffle-iron/waffle_iron_bg.js"].exports["__wbg_randomFillSync_d5bd2d655fdf256a"](p0i32,p1i32,p2i32);
/******/ 					},
/******/ 					"__wbg_self_1b7a39e3a92c949c": function() {
/******/ 						return installedModules["./src/lib/waffle-iron/waffle_iron_bg.js"].exports["__wbg_self_1b7a39e3a92c949c"]();
/******/ 					},
/******/ 					"__wbg_require_604837428532a733": function(p0i32,p1i32) {
/******/ 						return installedModules["./src/lib/waffle-iron/waffle_iron_bg.js"].exports["__wbg_require_604837428532a733"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_crypto_968f1772287e2df0": function(p0i32) {
/******/ 						return installedModules["./src/lib/waffle-iron/waffle_iron_bg.js"].exports["__wbg_crypto_968f1772287e2df0"](p0i32);
/******/ 					},
/******/ 					"__wbindgen_is_undefined": function(p0i32) {
/******/ 						return installedModules["./src/lib/waffle-iron/waffle_iron_bg.js"].exports["__wbindgen_is_undefined"](p0i32);
/******/ 					},
/******/ 					"__wbg_getRandomValues_a3d34b4fee3c2869": function(p0i32) {
/******/ 						return installedModules["./src/lib/waffle-iron/waffle_iron_bg.js"].exports["__wbg_getRandomValues_a3d34b4fee3c2869"](p0i32);
/******/ 					},
/******/ 					"__wbindgen_throw": function(p0i32,p1i32) {
/******/ 						return installedModules["./src/lib/waffle-iron/waffle_iron_bg.js"].exports["__wbindgen_throw"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbindgen_rethrow": function(p0i32) {
/******/ 						return installedModules["./src/lib/waffle-iron/waffle_iron_bg.js"].exports["__wbindgen_rethrow"](p0i32);
/******/ 					}
/******/ 				}
/******/ 			};
/******/ 		},
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/ 		promises.push(Promise.resolve().then(function() {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				importScripts(__webpack_require__.p + "" + ({}[chunkId]||chunkId) + ".bundle.worker.js");
/******/ 			}
/******/ 		}));
/******/
/******/ 		// Fetch + compile chunk loading for webassembly
/******/
/******/ 		var wasmModules = {"0":["./src/lib/waffle-iron/waffle_iron_bg.wasm"]}[chunkId] || [];
/******/
/******/ 		wasmModules.forEach(function(wasmModuleId) {
/******/ 			var installedWasmModuleData = installedWasmModules[wasmModuleId];
/******/
/******/ 			// a Promise means "currently loading" or "already loaded".
/******/ 			if(installedWasmModuleData)
/******/ 				promises.push(installedWasmModuleData);
/******/ 			else {
/******/ 				var importObject = wasmImportObjects[wasmModuleId]();
/******/ 				var req = fetch(__webpack_require__.p + "" + {"./src/lib/waffle-iron/waffle_iron_bg.wasm":"0610754a6c3de7fa1318"}[wasmModuleId] + ".module.wasm");
/******/ 				var promise;
/******/ 				if(importObject instanceof Promise && typeof WebAssembly.compileStreaming === 'function') {
/******/ 					promise = Promise.all([WebAssembly.compileStreaming(req), importObject]).then(function(items) {
/******/ 						return WebAssembly.instantiate(items[0], items[1]);
/******/ 					});
/******/ 				} else if(typeof WebAssembly.instantiateStreaming === 'function') {
/******/ 					promise = WebAssembly.instantiateStreaming(req, importObject);
/******/ 				} else {
/******/ 					var bytesPromise = req.then(function(x) { return x.arrayBuffer(); });
/******/ 					promise = bytesPromise.then(function(bytes) {
/******/ 						return WebAssembly.instantiate(bytes, importObject);
/******/ 					});
/******/ 				}
/******/ 				promises.push(installedWasmModules[wasmModuleId] = promise.then(function(res) {
/******/ 					return __webpack_require__.w[wasmModuleId] = (res.instance || res).exports;
/******/ 				}));
/******/ 			}
/******/ 		});
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// object with all WebAssembly.instance exports
/******/ 	__webpack_require__.w = {};
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/ts-loader/index.js?!./src/components/web-workers/waffle-iron-worker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/ts-loader/index.js?!./src/components/web-workers/waffle-iron-worker.ts":
/*!*******************************************************************************************!*\
  !*** ./node_modules/ts-loader??ref--5!./src/components/web-workers/waffle-iron-worker.ts ***!
  \*******************************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _waffle_iron_proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./waffle-iron-proxy */ "./src/components/web-workers/waffle-iron-proxy.ts");
/* harmony import */ var _interfaces__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./interfaces */ "./src/components/web-workers/interfaces.ts");


function assertNever(x) {
    throw new Error("Unexpected object: " + x);
}
addEventListener('message', (eventMessage) => {
    // At the time of writing, wasm module compilation is required to be performed from within an asynchronous
    // context. This restriction is still enforced even when the fetch/compilation is being performed from within a
    // web-worker. To obey it, the wasm module and its JS bindings are imported dynamically so that the compilation
    // step happens asynchronously.
    //
    // Note: The imported module appears to get cached so it should not trigger a re-compilation on each message, though
    // perhaps it might be a good choice to store it after loading anyway?
    __webpack_require__.e(/*! import() */ 0).then(__webpack_require__.bind(null, /*! ../../lib/waffle-iron/waffle_iron.js */ "./src/lib/waffle-iron/waffle_iron.js")).then(wi => {
        let proxy = new _waffle_iron_proxy__WEBPACK_IMPORTED_MODULE_0__["WaffleIronProxy"](wi);
        let request = eventMessage.data;
        let response = {
            id: request.id,
            task: request.task,
            data: null
        };
        switch (request.task) {
            case _interfaces__WEBPACK_IMPORTED_MODULE_1__["Task"].Generate:
                response.data = proxy.generate(request.data);
                break;
            case _interfaces__WEBPACK_IMPORTED_MODULE_1__["Task"].Solve:
                response.data = proxy.solve(request.data);
                break;
            default: assertNever(request);
        }
        postMessage(response);
    });
});


/***/ }),

/***/ "./src/components/web-workers/interfaces.ts":
/*!**************************************************!*\
  !*** ./src/components/web-workers/interfaces.ts ***!
  \**************************************************/
/*! exports provided: Task */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Task", function() { return Task; });
var Task;
(function (Task) {
    Task[Task["Solve"] = 0] = "Solve";
    Task[Task["Generate"] = 1] = "Generate";
})(Task || (Task = {}));


/***/ }),

/***/ "./src/components/web-workers/waffle-iron-proxy.ts":
/*!*********************************************************!*\
  !*** ./src/components/web-workers/waffle-iron-proxy.ts ***!
  \*********************************************************/
/*! exports provided: WaffleIronProxy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WaffleIronProxy", function() { return WaffleIronProxy; });
// Masks wasm_bindgen behavior by copying data into plain JS objects. Otherwise serializing or transferring wasm_bindgen
// objects over a boundary (such as web-worker -> main thread) ends in a copy of a pointer value and no ability to use 
// it. Wasm_bindgen also tends to free itself of ownership of data immediately after it is accessed, so copying
// everything in one go is probably less error prone than passing around a partially freed object.
class WaffleIronProxy {
    constructor(module) {
        this.module = module;
    }
    generate(data) {
        let config = undefined;
        if (data) {
            config = new this.module.GeneratorConfig();
            config.samples = data.samples;
            config.iterations = data.iterations;
            config.removals = data.removals;
        }
        const output = this.module.generate(config);
        return {
            difficulty: output.difficulty,
            puzzle: output.puzzle,
            solution: output.solution,
        };
    }
    solve(data) {
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


/***/ })

/******/ });
//# sourceMappingURL=waffle-iron-worker.bundle.worker.js.map