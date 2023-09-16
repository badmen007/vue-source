import { initMixin } from "./init";

function Vue(options) {
  this._init(options); // 为什么这里能拿到_init
}

initMixin(Vue);

export default Vue;
