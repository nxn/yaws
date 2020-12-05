import { WaffleIronProxy } from "./waffle-iron-proxy";
import { Task, Request, Response } from "@components/contracts/sudokuprovider";

function assertNever(x: never): never {
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
    import("../../lib/waffle-iron/waffle_iron.js").then(wi => {
        let proxy = new WaffleIronProxy(wi);
        let request = eventMessage.data as Request;
        let response: Response = {
            id: request.id,
            task: request.task,
            data: null
        }

        switch (request.task) {
            case Task.Generate:
                response.data = proxy.generate(request.data);
                break;
            case Task.Solve:
                response.data = proxy.solve(request.data);
                break;
            default: assertNever(request);
        }

        postMessage(response);
    });
});
