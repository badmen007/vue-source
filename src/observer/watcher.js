import { popTarget, pushTarget } from "./dep";

let id = 0
class Watcher {
  /**
   *
   * @param {*} vm 实例
   * @param {*} exprOrFn vm._update(vm._render())
   * @param {*} cb 
   * @param {*} options 
   */
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb;
    this.options = options;
    this.id = id++;

    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }

    this.get()
  }
  get() {
    pushTarget(this)
    this.getter()
    popTarget()
  }
  update() {
    this.get()
  }
}

export default Watcher