import { isReservedTag } from "../util";

export function renderMixin(Vue) {
  // 创建元素
  Vue.prototype._c = function () {
    return createElement(this, ...arguments)
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

function createElement(vm, tag, data={}, ...children) {
  // 如果是组件的话 要new 构造函数
  if (isReservedTag(tag)) {
    return vnode(tag, data, data.key, children);
  } else {
    let Ctor = vm.$options.components[tag]
    // 创建组件的虚拟节点
    return createComponent(vm, tag, data, data.key, children, Ctor)
  }
}

function createComponent(vm, tag, data, key, children, Ctor) {
  const baseCtor = vm.$options._base
  if (typeof Ctor === 'object') {
    Ctor = baseCtor.extend(Ctor)
  }
  // 给组件增加生命周期
  data.hook = { 
    init(vnode) {
      let child = vnode.componentInstance = new Ctor({})
      child.$mount() // 组件的$mount方法默认是不传参数的
    }
  }
  return vnode(`vue-component-${Ctor.cid} ${tag}`, data, key, undefined, undefined, { Ctor, children })
}

function createTextVnode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

function vnode(tag, data, key, children, text, componentOptions) {
  return {
    tag,
    data,
    key,
    children,
    text,
    componentOptions // 组件多出的属性 保存组件的构造函数和插槽
  }
}