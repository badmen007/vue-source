import { mergeOptions } from "../util"


export default function initExtend(Vue) {
  let cid = 0
  // 创建一个子类继承父类
  Vue.extend = function (extendOptions) {
    const Super = this
    const Sub = function VueComponent(options) {
      this._init(options)
    }
    Sub.cid = cid++
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    // 处理其他属性 mixin component

    Sub.options = mergeOptions(Super.options, extendOptions)
    Sub.components = Super.components
    //....
    return Sub
  }
}

// 组件渲染的流程 
// 1. 调用Vue.component
// 2. 内部用的是Vue.extend 就是产生一个子类来继承父类
// 3. 创建子类的实例时会调用父类的_init方法,再$mount