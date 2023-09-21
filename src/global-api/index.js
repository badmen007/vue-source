import { mergeOptions } from "../util"
import initExtend from "./extend"

export function initGlobalApi(Vue) {
  Vue.options = {}
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin)
  }
  // Vue 的构造函数保存在 _base中
  Vue.options._base = Vue
  Vue.options.components = {}

  initExtend(Vue)


  Vue.component = function(id, definition) {
    definition.name = definition.name || id
    // 根据当前组件对象，生成了一个子类的构造函数
    // 拿的是父类
    definition = this.options._base.extend(definition)
    Vue.options.components[id] = definition
  }
}