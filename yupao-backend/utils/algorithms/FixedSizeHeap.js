/**
 * 长度固定为k的优先队列
 */
module.exports = class FixedSizeHeap {
    constructor(k, compareFn) {
        this.heap = [];
        this.capacity = k;
        this.compare = compareFn;
    }

    // 入堆
    enqueue(item) {
        // 没达到堆容量前，直接插入尾部
        if (this.heap.length < this.capacity) {
            this.heap.push(item);
            // 上浮
            this.heapifyUp(this.heap.length - 1);
        } else {
            // a - b小顶堆
            // b - a大顶堆
            if (this.compare(item, this.heap[0]) > 0) {
                this.heap[0] = item;
                this.heapifyDown(0);
            }
        }
    }

    // 出堆
    dequeue() {
        // 堆为空
        if (this.isEmpty()) {
            return undefined;
        }
        // 将堆顶和最后一个元素交换位置，然后弹出最后一个元素
        const root = this.heap[0];
        const lastItem = this.heap.pop();
        if (!this.isEmpty()) {
            this.heap[0] = lastItem;
            this.heapifyDown(0);
        }
        return root;
    }

    peek() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.heap[0];
    }

    size() {
        return this.heap.length;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    heapifyUp(index) {
        while (index > 0) {
            // 父索引
            const parentIndex = Math.floor((index - 1) / 2);
            // compare为a - b时，这句会在子节点小于父节点时执行，说明是小顶堆
            // 为b - a时，这句会在子节点大于父结点时执行，说明是大顶堆
            if (this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
                [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    heapifyDown(index) {
        while (index < this.heap.length) {
            const leftChildIndex = index * 2 + 1;
            const rightChildIndex = index * 2 + 2;
            let smallestIndex = index;
            if (leftChildIndex < this.heap.length && this.compare(this.heap[leftChildIndex], this.heap[smallestIndex]) < 0) {
                smallestIndex = leftChildIndex;
            }
            if (rightChildIndex < this.heap.length && this.compare(this.heap[rightChildIndex], this.heap[smallestIndex]) < 0) {
                smallestIndex = rightChildIndex;
            }
            if (smallestIndex === index) {
                break;
            }
            [this.heap[smallestIndex], this.heap[index]] = [this.heap[index], this.heap[smallestIndex]];
            index = smallestIndex;
        }
    }
} 