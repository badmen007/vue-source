import { initGlobalApi } from "./global-api/index";
import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { stateMixin } from "./state";
import { renderMixin } from "./vdom/index";

function Vue(options) {
  this._init(options); // 为什么这里能拿到_init
}

initMixin(Vue);
lifecycleMixin(Vue)
renderMixin(Vue)
stateMixin(Vue)
initGlobalApi(Vue)

export default Vue;
