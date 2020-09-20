export interface IQueue<T>{
    readonly size:  number;
    maxSize:        number;
    enqueue:        (item: T) => T | void;
    dequeue:        () => T | void;
    first:          () => T | void;
    last:           () => T | void;
    while:          (fn:(arg:T) => boolean) => void;
    whileRev:       (fn:(arg:T) => boolean) => void;
    each:           (fn:(arg:T) => void)    => void;
    eachRev:        (fn:(arg:T) => void)    => void;
}

interface _IQueue<T> extends IQueue<T> {
    firstNode?: IQueueNode<T>;
    lastNode?:  IQueueNode<T>;
    size:       number;
}

interface IQueueNode<T> {
    prev: IQueueNode<T>;
    data: T;
    next: IQueueNode<T>;
}

export function createQueue<T>(maxSize?: number): IQueue<T> {
    const queue: _IQueue<T> = 
        { enqueue:  (item:T)    => _enqueue(queue, item)
        , dequeue:  ()          => _dequeue(queue)
        , first:    ()          => _first(queue)
        , last:     ()          => _last(queue)
        , while:    (fn:(arg:T) => boolean):void => _while(queue, fn)
        , whileRev: (fn:(arg:T) => boolean):void => _whileRev(queue, fn)
        , each:     (fn:(arg:T) => void):void    => _each(queue, fn)
        , eachRev:  (fn:(arg:T) => void):void    => _eachRev(queue, fn)
        , get maxSize()     { return maxSize; }
        , set maxSize(v)    { maxSize = v; while (queue.size > maxSize) { _dequeue(queue); } }
        , size:     0
        };

    return queue;
};

function _while<T>(queue: _IQueue<T>, fn: (item:T) => boolean): void {
    let node = queue.firstNode
    let sentinel = true;

    if (!node) {
        return;
    }

    do { sentinel = fn(node.data); } while (sentinel && (node = node.next));
};

function _whileRev<T>(queue: _IQueue<T>, fn: (item:T) => boolean): void {
    let node = queue.lastNode
    let sentinel = true;

    if (!node) {
        return;
    }

    do { sentinel = fn(node.data); } while (sentinel && (node = node.prev));
};

function _each<T>(queue: _IQueue<T>, fn: (item:T) => void): void {
    _while(queue, function(thing) {
        fn(thing);
        return true;
    });
};

function _eachRev<T>(queue: _IQueue<T>, fn: (item:T) => void): void {
    _whileRev(queue, function(thing) {
        fn(thing);
        return true;
    });
};

function _first<T>(queue: _IQueue<T>): T | void {
    if (queue.firstNode) {
        return queue.firstNode.data;
    }
};

function _last<T>(queue: _IQueue<T>): T | void {
    if (queue.lastNode) {
        return queue.lastNode.data;
    }
};

function _enqueue<T>(queue: _IQueue<T>, item: T): T | void {
    const node:IQueueNode<T> = 
        { prev: queue.lastNode
        , data: item
        , next: null
        };

    if (queue.size === 0) {
        queue.firstNode = node;
        queue.lastNode = node;
    }
    else {
        queue.lastNode.next = node;
        queue.lastNode = node;
    }

    queue.size++;
    
    // if maxSize is undefined the condition is false
    if (queue.size > queue.maxSize) {
        return _dequeue(queue);
    }
};

function _dequeue<T>(queue: _IQueue<T>): T | void {
    if (queue.size === 0) {
        return;
    }

    const node = queue.firstNode;
    queue.firstNode = queue.firstNode.next;

    if (queue.firstNode) {
        queue.firstNode.prev = null;
    } else {
        queue.lastNode = null;
    }
    
    queue.size--;

    return node.data;
};