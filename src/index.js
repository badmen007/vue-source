import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./vdom/index";

function Vue(options) {
  this._init(options); // 为什么这里能拿到_init
}

initMixin(Vue);
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue;
