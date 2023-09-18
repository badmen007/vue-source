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

    return result;
  };
});
