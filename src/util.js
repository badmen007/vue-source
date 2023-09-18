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
strates.data = function (parentVal, childVal) {
  return childVal; // 这里有data的合并操作
};
strates.computed = function () {};
strates.watch = function () {};

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
      options[key] = child[key]
    }
  }

  return options
}