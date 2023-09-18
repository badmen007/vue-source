import { defineProperty } from "../util";
import { arrayMethods } from "./array";
import Dep from "./dep";

class Observer {
  constructor(value) {
    this.dep = new Dep()
    defineProperty(value, '__ob__', this)
    if (Array.isArray(value)) {
      value.__proto__ = arrayMethods;
      // 要对数组中的每一项都进行观测
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  observeArray(value) {
    value.forEach((item) => {
      observe(item);
    });
  }
  walk(data) {
    const keys = Object.keys(data);
    keys.forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
}

function defineReactive(data, key, value) {
  // 如果数据中的值是对象 要观测
  // 获取到数组对应的dep
  let childDep = observe(value);
  let dep = new Dep() // 每个属性都有一个dep
  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) { // 依赖收集
        dep.depend()
        if (childDep) { // 这里主要是处理数组的
          childDep.dep.depend() // 数组存起来这个渲染watcher
        }
      }
      return value;
    },
    set(newVal) {
      if (newVal === value) return;
      // 如果用户设置的值是对象类型的话，也要观测
      observe(newVal);
      value = newVal; // 这里为什么没有用data[key]的形式 如果用了就死循环了

      dep.notify() // 依赖更新
    },
  });
}

export function observe(data) {
  // 要看是不是对象，不是对象就不进行观测
  if (typeof data !== "object" || data === null) {
    return;
  }

  if (data.__ob__) {
    return data
  }

  return new Observer(data);
}
