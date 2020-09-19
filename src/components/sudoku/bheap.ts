import { Maybe, Some, Nothing } from './maybe';

export type TScorer<T> = (item: T) => number;

export abstract class BinaryHeapBase<T> {
    protected heap: T[];
    protected scorerFn: TScorer<T>;

    protected constructor(array: T[], score: TScorer<T>) {
        this.heap = array;
        this.scorerFn = score;
    }

    public size(): number {
        return this.heap.length;
    }

    public push(item: T): void {
        this.heap.push(item);
        this.siftUp(this.size() - 1);
    }

    public pop(): Maybe<T> {
        const result = this.get(0);
        const end = this.heap.pop();

        if (this.size() > 0) {
            this.set(0, end);
            this.siftDown(0);
        }

        return result;
    }

    public remove(item: T): void {
        const size = this.size();

        for (let i = 0; i < size; i++) {
            if (this.get(i).value !== item) continue;

            // Take the last element and use it to replace the one we're removing.
            const end = this.heap.pop();

            // If we were supposed to remove the last element we are done.
            if (i == size - 1) break;

            // Fill the gap, then let it move up or down as needed
            this.set(i, end);
            this.siftUp(i);
            this.siftDown(i);
            break;
        }
    }

    protected score(index: number): number {
        return this.scorerFn(this.get(index).value);
    }

    protected parentOf(index: number): number {
        return (index - 1) / 2 | 0;
    }
    
    protected childOf(index: number, choice: Child): number { 
        return index * 2 + choice;
    }

    protected swap(indexA: number, indexB: number): void {
        const valueA   = this.get(indexA).value;
        this.set(indexA, this.get(indexB).value);
        this.set(indexB, valueA);
    }

    // TODO: Use Maybe/Option
    protected get(index: number): Maybe<T> {
        if (index < 0 || index >= this.size()) {
            return Nothing;
        }

        return new Some(this.heap[index]);
    }

    // TODO: Use Maybe/Option
    protected set(index: number, value: T): void {
        if (index < 0 || index >= this.size()) {
            throw new RangeError(ErrorMessages.OutOfBounds);
        }

        this.heap[index] = value;
    }

    protected heapify(): void {
        let start = this.parentOf(this.size() - 1);
        while (start >= 0) {
            this.siftDown(start);
            start = start - 1;
        }
    }

    protected siftUp(root: number): void {
        const score = this.score(root);

        while (root > 0) {
            const parentIndex = this.parentOf(root);

            if (score >= this.score(parentIndex)) {
                break;
            }
        
            this.swap(root, parentIndex);
            root = parentIndex;
        }
    }

    protected siftDown(root: number): void {
        const size  = this.size();
        const score = this.score(root);

        while(true) {
            let   swapIndex = root;
            let   swapScore = score;
            const leftIndex  = this.childOf(root, Child.Left);
            const rightIndex = this.childOf(root, Child.Right);

            if (leftIndex < size) {
                const leftScore = this.score(leftIndex);

                if (leftScore < swapScore) {
                    swapIndex = leftIndex;
                    swapScore = leftScore;
                }
            }

            if (rightIndex < size) {
                const rightScore = this.score(rightIndex);

                if (rightScore < swapScore) {
                    swapIndex = rightIndex;
                }
            }

            if (swapIndex == root) {
                break;
            }

            this.swap(root, swapIndex);
            root = swapIndex;
        }
    }
}

/* Adds static factory methods for the base class. Unfortunately, putting these directly in the base class would cause 
problems for derived classes that manage generic items within the heap. The compiler is unable to determine the type of
items within the generic container unless the factory call contains a substantial amount of generic type information.
I.E., a factory method invokation would have to look as follows to ensure that the compiler is able to determine the
types involved:

    DerivedHeap.using<DerivedHeap<TItem>, TContainer<Titem>>(items: TContainer<TItem>[])

Since this is far too cumbersome to be practical, the factories are instead placed here so that derived classes can
extend BinaryHeapBase and have their own factories that don't conflict with these.
*/
export class BinaryHeap<T> extends BinaryHeapBase<T> {
    public static create<U>(score: TScorer<U>): BinaryHeap<U> {
        return new BinaryHeap<U>([], score);
    }

    public static from<U>(items: U[], score: TScorer<U>): BinaryHeap<U> {
        const instance = new BinaryHeap<U>([], score);

        for(let i = 0; i < items.length; i++) {
            instance.push(items[i]);
        }

        return instance;
    }

    public static using<U>(items: U[], score: TScorer<U>): BinaryHeap<U> {
        const instance = new BinaryHeap<U>(items, score);
        instance.heapify();
        return instance;
    }

    private constructor(items: T[], score: TScorer<T>) {
        super(items, score);
    }
}

enum Child { Left = 1, Right = 2 }

enum ErrorMessages {
    OutOfBounds = "Heap index out of bounds"
}
