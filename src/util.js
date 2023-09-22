export function proxy(vm, data, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[data][key];
    },
    set(newValue) {
      vm[data][key] = newValue;
    },
  });
}

export function defineProperty(target, key, value) {
  Object.defineProperty(target, key, {
    value,
    enumerable: false, // 不可枚举的属性，不能被循环出来 后面walk中不能循环出来
    configurable: false,
  });
}

const LIFECYCLE_HOOKS = [
  "beforeCreated",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "beforeDestroy",
  "destroyed",
];
const strates = {}
strates.components = function (parentVal, childVal) {
  const res = Object.create(parentVal)
  if (childVal) {
    for(let key in childVal) {
      res[key] = childVal[key]
    }
  }
  return res
}
strates.data = function (parentVal, childVal) {
  return childVal; // 这里有data的合并操作
};
// strates.computed = function () {};
// strates.watch = function () {};

function mergeHook(parentVal, childVal) {
  if (childVal) {
    // 儿子有，父亲没有，返回父亲就行
    if (parentVal) {
      // 儿子有，父亲也有，合并
      return parentVal.concat(childVal);
    } else {
      // 儿子有 父亲没有 将儿子放到数组中
      return [childVal];
    }
  } else {
    return parentVal;
  }
}

LIFECYCLE_HOOKS.forEach(hook => {
  strates[hook] = mergeHook;
})
export function mergeOptions(parent, child) {
  const options = {}
  for(let key in parent) {
    mergeField(key)
  }

  for(let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }

  function mergeField(key) {
    if (strates[key]) {
      options[key] = strates[key](parent[key], child[key])
    } else {
      if (child[key]) {
        options[key] = child[key];
      } else {
        options[key] = parent[key]
      }
    }
  }

  return options
}


let callbacks = []
let timerFunc;
let pending = false
function flushCallbacks() {
  while(callbacks.length) {
    const cb = callbacks.pop()
    cb()
  }
  pending = false
}
if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks)
  }
} else if (MutationObserver) { // 可以监控dom的变化
  let observe = new MutationObserver(flushCallbacks)
  let textNode = document.createTextNode(1)
  observe.observe(textNode, { characterData: true})
  timerFunc = () => {
    textNode.textContent = 2
  }
} else if (setImmediate) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks)
  }
}


export function nextTick(cb) { // 异步只需要一次
  callbacks.push(cb)
  if (!pending) {
    timerFunc() // 异步方法做了兼容处理
    pending = true
  }
}

function makeMap(str) {
  const mapping = {}
  const list = str.split(',')
  for(let i = 0; i < list.length; i++) {
    mapping[list[i]] = true
  }
  return (key) => mapping[key]
}

export const isReservedTag = makeMap(
  'a,div,img,image,text,span,p,button,input,textarea,ul,li'
)