/*
    A complete binary heap was used for making the priority queue snd setTimeout for scheduling the tasks
*/


'use strict';
const fs = require('fs');
var filename = String(process.argv[2])
var start = new Date(process.argv[3])

//file processing
var data = fs.readFileSync(filename, {encoding:'utf8'}); 

data = data.split('\n')
var processes= []
for(let i = 1; i < data.length; i++){
    processes.push(data[i].replace(/(\r\n|\n|\r)/gm, "").split(", "))
}

//node of the priority queue
class Node {
    constructor(name, time, priority=0) {
        this.name = name;
      this.time = time;
      this.priority = priority;
      this.next = null;
    }
}


class PriorityQueue {
    constructor() {
      this.heap = [null]
    }
    //comparators
    isGreater(a,b){
        if(new Date(a.time) < new Date(b.time))
            return true;
        if(new Date(a.time) === new Date(b.time) && parseInt(a.priority) > parseInt(b.priority))
            return true;
        return false;
    }

    isLessEq(a,b){
        if(new Date(a.time) > new Date(b.time))
            return true;
        if(new Date(a.time) === new Date(b.time) && parseInt(a.priority) < parseInt(b.priority))
            return true;
        if(new Date(a.time) === new Date(b.time) && parseInt(a.priority) === parseInt(b.priority))
            return true;
        return false;
    }

    insert(name, time, priority) {
      const newNode = new Node(name, time, priority);
      this.heap.push(newNode);
      let currentNodeIdx = this.heap.length - 1;
      let currentNodeParentIdx = Math.floor(currentNodeIdx / 2);
      while (
        this.heap[currentNodeParentIdx] &&
        this.isGreater(newNode, this.heap[currentNodeParentIdx])
      ) {
        const parent = this.heap[currentNodeParentIdx];
        this.heap[currentNodeParentIdx] = newNode;
        this.heap[currentNodeIdx] = parent;
        currentNodeIdx = currentNodeParentIdx;
        currentNodeParentIdx = Math.floor(currentNodeIdx / 2);
      }
    }

    heapify(index){
        let currentIdx = index;
        let [left, right] = [2*currentIdx, 2*currentIdx + 1];
        if(left < this.heap.length && this.isLessEq(this.heap[currentIdx], this.heap[left]))
            currentIdx = left;
        if(right < this.heap.length && this.isLessEq(this.heap[currentIdx], this.heap[right]))
            currentIdx = right;
        if(currentIdx != index){
            let currentNode = this.heap[index]
          let currentChildNode = this.heap[currentIdx];
          this.heap[currentIdx] = currentNode;
          this.heap[index] = currentChildNode;
          this.heapify(currentIdx)
        }
    }

    remove() {
        if (this.heap.length < 3) {
          const toReturn = this.heap.pop();
          this.heap[0] = null;
          return toReturn;
        }
        const toRemove = this.heap[1];
        this.heap[1] = this.heap.pop();
        //console.log(this.heap)
        this.heapify(1)
        return toRemove;
    }
}


//make the priority queue and insert the processes
var pq = new PriorityQueue()

for(let process of processes){
    pq.insert(process[0], process[1], process[2]);
}


//schedule tasks using setTimeout
start = Date.parse(start)
var len = pq.heap.length;
for(let i = 1; i < len; i++){
    let node = pq.remove()
    let time = Date.parse(new Date(node.time))
    setTimeout(()=>{
        console.log(`Current time [ ${node.time} ] , Event ${node.name} Processed`)
    }, time-start)
}







