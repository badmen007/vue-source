import Watcher from "./observer/watcher"
import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    // 首次渲染还是更新
    const prevVnode = vm._vnode
    if (!prevVnode) {
      vm.$el = patch(vm.$el, vnode)
    } else {
      vm.$el = patch(prevVnode, vnode)
    }
    vm._node = vnode;
  }
}

export function mountComponent(vm, el) {
  // 调用render方法去渲染 el属性

  // 先调用render方法创建虚拟节点， 将虚拟节点渲染到页面上
  callHook(vm, 'beforeMount')
  const updateComponent = () => {
    vm._update(vm._render());
  }
  // 要把属性和watcher对应  初始化的时候就会创建
  new Watcher(vm, updateComponent, () => {
    callHook(vm, 'updated')
  }, true)

  callHook(vm, 'mounted')
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    for(let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm)
    }
  }
}