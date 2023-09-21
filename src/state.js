import Dep from "./observer/dep";
import { observe } from "./observer/index";
import Watcher from "./observer/watcher";
import { nextTick, proxy } from "./util";

export function initState(vm) {
  const opts = vm.$options;
  if (opts.props) {
    initProps(vm);
  }
  if (opts.data) {
    initData(vm);
  }
  if (opts.methods) {
    initMethods(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}
function initProps() {}

function initData(vm) {
  let data = vm.$options.data;

  // data可能是一个函数，也可能是一个对象
  // 如果是函数的话要拿到返回值，对象的话就不用处理
  vm._data = data = typeof data === "function" ? data.call(vm) : data;

  // 属性代理
  for(let key in data) {
    proxy(vm, '_data', key)
  }

  // 对数据进行观测
  observe(data);
}

function initMethods() {}
function initComputed(vm) {
  const computed = vm.$options.computed
  // 1.需要有watcher 2.需要defineProperty 3.dirty
  const watchers = vm._computedWatchers = {} 
  for(let key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    watchers[key] = new Watcher(vm, getter, () => {}, { lazy: true})
    defineComputed(vm, key, userDef)
  }
}

function defineComputed(target, key, userDef) {
  const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: () => {},
    set: () => {}
  };
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key)
  } else {
    sharedPropertyDefinition.get = createComputedGetter(key) // 需要加缓存
    sharedPropertyDefinition.set = userDef.set
  }

  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
  return function () {
    const watcher = this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate()
      }
      // 在上面计算值完成之后，当前的Dep.target是渲染watcher 让计算属性依赖的dep收集渲染watcher页面就能刷行
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}

function initWatch(vm) {
  const watch = vm.$options.watch
  for(let key in watch) {
    const handler = watch[key] // handler可能是数组、函数、对象、字符串

    if (Array.isArray(handler)) { // 处理数组
      handler.forEach(handle => {
        createWatcher(vm, key, handle); 
      })
    } else {
      createWatcher(vm, key, handler) // 处理函数、对象、字符串类型的
    }
  }
}

function createWatcher(vm, exprOrFn, handler, options = {}) { // options可以标识是用户watcher
  if (typeof handler === 'object') {
    options = handler
    handler = handler.handler
  }

  if (typeof handler === 'string') {
    handler = vm[handler]
  }

  return vm.$watch(exprOrFn, handler, options)
}

export function stateMixin(Vue) {
  Vue.prototype.$nextTick = function (cb) {
    nextTick(cb)
  }
  Vue.prototype.$watch = function (exprOrFn, cb, options) {
    const watcher = new Watcher(this, exprOrFn, cb, {...options, user: true})

    if (options.immediate) {
      cb()
    }
  }
}
