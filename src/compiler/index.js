import { generate } from "./generate";
import { parseHTML } from "./parse";


export function compileToFunctions(template) {
  // html模版 =》 render函数 (ast是用来描述代码的)
  // 1.需要将html代码转化成‘ast'语法树 可以用ast树来描述语言本身

  const ast = parseHTML(template);
  // 2.优化静态节点
  // 3.通过这颗树，重新生成代码
  const code = generate(ast)
  
  // 4.将字符串变成函数
  let render = new Function(`with(this){return ${code}}`)

}
