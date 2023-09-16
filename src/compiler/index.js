const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // ?: 匹配不捕获 </my:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const startTagClose = /^\s*(\/?)>/;
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;



function parseHTML(html) {

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName, // 标签名
      type: 1, // 元素类型
      children: [], // 儿子
      attrs, // 属性
      parent: null, // 父亲
    };
  }
  let root;
  let currentParent;
  // 校验标签是不是符合预期
  let stack = []
  function start(tagName, attrs) {
    let element = createASTElement(tagName, attrs);
    if (!root) {
      root = element
    }
    currentParent = element // 解析当前的标签 保存
    stack.push(element) // 将生成的ast元素放到栈中
  }

  function end(tagName) { // 在结尾的时候创建父子关系
    const element = stack.pop()
    currentParent = stack[stack.length - 1]
    if (currentParent) { // 闭合的时候可以知道这个标签的父亲是谁
      element.parent = currentParent
      currentParent.children.push(element)
    }
  }

  function chars(text) {
    text = text.replace(/\s/g, '')
    if (text) {
      currentParent.children.push({
        type: 3,
        text
      })
    }
  }


  // 只要html不空 就一直解析
  while(html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      // 肯定是标签
      // 处理开始标签
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      // 处理结束标签
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    let text;
    if (textEnd > 0) { // 文本
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      chars(text)
    }
  }
  function advance(n) {
    html = html.substring(n)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)
      let end, attr;
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] });
        advance(attr[0].length) // 去掉当前的属性
      }
      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }
  return root
}

export function compileToFunctions(template) {
  // html模版 =》 render函数 (ast是用来描述代码的)
  // 1.需要将html代码转化成‘ast'语法树 可以用ast树来描述语言本身

  const ast = parseHTML(template);
  console.log(ast);
  // 2.通过这颗树，重新生成代码
}
