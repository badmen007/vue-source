class Observer {
  constructor(value) {
    this.walk(value)
  }
  walk(data) {
    const keys = Object.keys(data)
    keys.forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

function defineReactive(data, key, value) {
  // 如果数据中的值是对象 要观测
  observe(value)
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newVal) {
      if (newVal === value) return
      // 如果用户设置的值是对象类型的话，也要观测
      observe(newVal)
      value = newVal // 这里为什么没有用data[key]的形式 如果用了就死循环了
    }
  })
}

export function observe(data) {
  // 要看是不是对象，不是对象就不进行观测
  if (typeof data !== "object" || data === null) {
    return;
  }

  new Observer(data);
}
