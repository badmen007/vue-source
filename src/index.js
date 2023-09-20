import { compileToFunctions } from "./compiler/index";
import { initGlobalApi } from "./global-api/index";
import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { stateMixin } from "./state";
import { renderMixin } from "./vdom/index";
import { createElm, patch } from "./vdom/patch";

function Vue(options) {
  this._init(options); // 为什么这里能拿到_init
}

initMixin(Vue);
lifecycleMixin(Vue)
renderMixin(Vue)
stateMixin(Vue)
initGlobalApi(Vue)


const vm1 = new Vue({data: {name: 'xz'}})
let render1 = compileToFunctions(`<div>
  <li style='background: red' key="A">A</li>
  <li style='background: yellow' key="B">B</li>
  <li style='background: pink' key="C">C</li>
  <li style='background: green' key="D">D</li>
</div>`);
let vnode1 = render1.call(vm1)
document.body.appendChild(createElm(vnode1));


const vm2 = new Vue({ data: { name: "aj" } })
let render2 = compileToFunctions(`<div>
  <li style='background: green' key="D">D</li>
  <li style='background: pink' key="C">C</li>
  <li style='background: yellow' key="B">B</li>
  <li style='background: red' key="A">A</li>
</div>`);
let vnode2 = render2.call(vm2);

setTimeout(() => {
  patch(vnode1, vnode2);
}, 3000)

export default Vue;
