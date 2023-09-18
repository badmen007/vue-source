import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    vm.$el = patch(vm.$el, vnode)
  }
}

export function mountComponent(vm, el) {
  // 调用render方法去渲染 el属性

  // 先调用render方法创建虚拟节点， 将虚拟节点渲染到页面上
  callHook(vm, 'beforeMount')
  vm._update(vm._render())
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