import { nextTick } from "../util";
import { popTarget, pushTarget } from "./dep";

let id = 0
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb;
    this.options = options;
    this.id = id++;
    this.deps = []
    this.depsId = new Set()

    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }

    this.get()
  }
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this)
    }
  }
  get() {
    pushTarget(this)
    this.getter()
    popTarget()
  }
  run() {
    this.get()
  }
  update() {
    queueWatcher(this)
    // this.get()
  }
}
let queue = [];
let has = {}
let pending = false

function flushSchedulerQueue() {
  queue.forEach((watcher) => {watcher.run();watcher.cb()});
  queue = [];
  has = {};
  pending = false;
}

function queueWatcher(watcher) {
  // 相同的就不存了 去重
  const id = watcher.id
  if (has[id] == null) {
    queue.push(watcher)
    has[id] = true
    if (!pending) {
      nextTick(flushSchedulerQueue)
    }
    pending = true
  }
}

export default Watcher