export function range(start?: number, end?: number): number[] {
    if (end === undefined) {
        if (start === undefined) {
            return [];
        }

        if (start === 0) {
            return [0];
        }

        if (start < 0) {
            end = -1;
        } else {
            end = start;
            start = 1;
        }
    }

    const length = (end - start) + 1;
    const arr: number[] = new Array(length);

    for(let i = 0; i < length; i++) {
        arr[i] = start + i;
    }
    return arr;
}

export function curry(fn: (..._: any[]) => any) {
    return function partial(...xs: any[]) {
        if (xs.length >= fn.length) {
            return fn(...xs);
        }
        return (...ys: any[]) => partial(...xs.concat(ys));
    }
}
export function pipe(...fns: Function[]) {
    return (x:any) => fns.reduce((y, f) => f(y), x);
}
export function compose(...fns: Function[]) {
    return (x:any) => fns.reduceRight((y, f) => f(y), x);
}

export function createLogger(config?: { debug?: boolean }): () => void {
    return () => {
        if (config.debug && console && console.log) {
            console.log.apply(null, arguments);
        }
    }
}
    
export function rand<T>(input: number | T[]): number | T {
    if (typeof input === 'number') {
        return Math.random() * input | 0;
    }

    if (Array.isArray(input)) {
        return input[ Math.random() * input.length | 0 ];
    }
}
    
export function uuid(): string { 
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( 
        /[xy]/g,  
        function(c) { 
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); 
            return v.toString(16); 
        } 
    );
};
    
export function locationOf<T>(item: T, array: T[], comparer: (a: T, b: T) => number, start = 0, end = array.length)
: number {
    if (array.length === 0) {
        return -1;
    }
    
    const pivot = (start + end) >> 1;
    const c = comparer(item, array[pivot]);

    if (end - start <= 1) {
        return c === -1 ? pivot - 1 : pivot;
    }

    switch (c) {
        case -1: return locationOf(item, array, comparer, start, pivot);
        case  0: return pivot;
        case  1: return locationOf(item, array, comparer, pivot, end);
    };
}
