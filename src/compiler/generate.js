// 语法层面的转义

function genProps(attrs) {
  let str = ''
  for(let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name === 'style') {
      const obj = {}
      attr.value.split(';').forEach(item => {
        const [key, value] = item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

function gen(node) {
  if (node.type === 1) {
    return generate(node)
  } else {
    const text = node.text
    // 如果是普通文本
    return `_v(${JSON.stringify(text)})`
  }
}

function genChildren(el) {
  const children = el.children;
  if (children) {
    return children.map((child) => gen(child)).join(",");
  }
}

export function generate(el) {
  let children = genChildren(el)
  const code = `_c('${el.tag}', ${
    el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'
  }${
    children ? `,${children}` : ''
  })`

  return code
}