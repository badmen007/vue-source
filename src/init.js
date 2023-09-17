import { compileToFunctions } from "./compiler/index";
import { mountComponent } from "./lifecycle";
import { initState } from "./state";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;

    initState(vm);

    // 如果当前有el属性，说明要渲染模版
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  };

  Vue.prototype.$mount = function(el) {
    // 挂载操作
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)
    
    if (!options.render) {
      // 没有render 将template转换成render
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      // 将模版编译成render函数
      const render = compileToFunctions(template)
      options.render = render
    }
    // 挂载组件
    mountComponent(vm, el)
  }
}
