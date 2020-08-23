import { WaffleIronProxy } from "./waffle-iron-proxy";

import { 
    Task,
    Request,
    Response,
    IGenerateRequestData, 
    IGenerateResponseData,
    ISolveRequestData, 
    ISolveResponseData,
} from "./interfaces";

export interface IWaffleIron {
    generate(request?: IGenerateRequestData): Promise<IGenerateResponseData>;
    solve(request: ISolveRequestData): Promise<ISolveResponseData>;
}

type Callback = (response: any) => void;

class WaffleIronWorker implements IWaffleIron {
    private pending: Map<number, Callback>;
    private worker: Worker;
    private request_id = 0;

    constructor() {
        this.pending = new Map();
        this.worker = new Worker('./waffle-iron-worker', { name: 'waffle-iron-worker', type: 'module' });
        this.worker.onmessage = (ev: MessageEvent) => this.responseHandler(ev);
    }

    public generate(request?: IGenerateRequestData): Promise<IGenerateResponseData> {
        return this.requestHandler({ task: Task.Generate, data: request });
    }

    public solve(request: ISolveRequestData): Promise<ISolveResponseData> {
        return this.requestHandler({ task: Task.Solve, data: request });
    }

    private requestHandler<T>(request: Request): Promise<T> {
        return new Promise<T>(
            (callback: Callback) => {
                request.id = this.request_id;

                this.pending.set(request.id, callback);
                this.worker.postMessage(request);
                this.request_id++;
            }
        );
    }

    private responseHandler(message: MessageEvent) {
        const response = message.data as Response;

        let callback = this.pending.get(response.id);
        this.pending.delete(response.id);

        if (callback) {
            callback(response.data);
        }
    }
}

class WaffleIronModule implements IWaffleIron {
    private proxy: WaffleIronProxy;
    private pending: [Request, Callback][];

    constructor() {
        this.pending = new Array();
        import("../../lib/waffle-iron/waffle_iron.js").then(wi => {
            this.proxy = new WaffleIronProxy(wi);

            while (this.pending.length > 0)  {
                let task = this.pending.shift();
                this.process(task[0], task[1]);
            }
        });
    }

    public generate(request?: IGenerateRequestData): Promise<IGenerateResponseData> {
        return this.requestHandler({ task: Task.Generate, data: request });
    }

    public solve(request: ISolveRequestData): Promise<ISolveResponseData> {
        return this.requestHandler({ task: Task.Solve, data: request });
    }

    public requestHandler<T>(request: Request): Promise<T> {
        return new Promise<T>(
            (callback: Callback) => {
                if (this.proxy) {
                    this.process(request, callback);
                }
                else {
                    this.pending.push([request, callback]);
                }
            }
        );
    }

    private assertNever(x: never): never {
        throw new Error("Unexpected object: " + x);
    }

    private process(request: Request, callback: Callback) {
        if (!this.proxy) {
            throw new Error("Waffle-Iron module not ready");
        }

        switch (request.task){
            case Task.Generate:
                return callback(this.proxy.generate(request.data));
            case Task.Solve:
                return callback(this.proxy.solve(request.data));
            default: this.assertNever(request)
        }
    }
}

export const waffleIron: IWaffleIron = self.Worker ? new WaffleIronWorker() : new WaffleIronModule;