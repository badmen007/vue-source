const oldArrayProtoMethods = Array.prototype;

export const arrayMethods = Object.create(oldArrayProtoMethods);

const methods = [
  "push",
  "pop",
  "shift",
  "unshift",
  "sort",
  "reverse",
  "splice",
];

methods.forEach((method) => {
  arrayMethods[method] = function (...args) {
    // 当调用数组劫持的这些方法的时候 页面应该更新
    const result = oldArrayProtoMethods[method].apply(this, args); // 这里的this是谁 就是调用方法的那个数组
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
        break;
      default:
        break;
    }
    if (inserted) {
      // 数组新增的值要进行观测
      this.__ob__.observeArray(inserted);
    }
    this.__ob__.dep.notify() // 通知数组更新
    return result;
  };
});
