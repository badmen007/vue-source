export function renderMixin(Vue) {
  // 创建元素
  Vue.prototype._c = function () {
    return createElement(...arguments)
  };
  // 创建文本元素
  Vue.prototype._v = function (text) {
    return createTextVnode(text)
  };
  // stringify
  Vue.prototype._s = function (val) {
    return val === null ? '' : (typeof val === 'object') ? JSON.stringify(val) : val
  };
  Vue.prototype._render = function () {
    const vm = this;
    const render = vm.$options.render;
    let vnode = render.call(vm);
    return vnode;
  };
}

function createElement(tag, data={}, ...children) {
  return vnode(tag, data, data.key, children)
}
function createTextVnode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text
  }
}