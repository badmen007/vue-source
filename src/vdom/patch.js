
export function patch(oldVnode, vnode) {
  const el = createElm(vnode)
  const parentElm = oldVnode.parentNode
  parentElm.insertBefore(el, oldVnode.nextSibling)
  parentElm.removeChild(oldVnode);
  return el
}

function createElm(vnode) {
  const { tag, children, key, data, text } = vnode
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    children.forEach(child => { // 遍历儿子将儿子渲染出的结果渲染到父亲中
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}