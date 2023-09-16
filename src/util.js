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
