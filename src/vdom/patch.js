export function patch(oldVnode, vnode) {
  // 在初始化的时候，是直接将虚拟dom转换成真实dom
  if (oldVnode.nodeType === 1) {
    const el = createElm(vnode);
    const parentElm = oldVnode.parentNode;
    parentElm.insertBefore(el, oldVnode.nextSibling);
    parentElm.removeChild(oldVnode);
    return el;
  } else {
    // 将老的虚拟节点 和 新的虚拟节点 进行比对 只更新改变的
    // 更新虚拟节点

    // 1. 比较两个元素的标签，标签不一样的话直接替换
    if (oldVnode.tag !== vnode.tag) {
      return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
    }

    // 2. 标签一样 文本节点的tag都是undefined 说明是文本节点
    
    if (!oldVnode.tag) { // 说明此时是文本节点
      if (oldVnode.text !== vnode.text) {
        return oldVnode.el.textContent = vnode.text
      }
    }

    // 3. 标签一样 并且需要开始比对标签的属性和儿子
    // 复用老节点
    vnode.el = oldVnode.el

    // 更新属性，用新的虚拟节点属性和老的比较 去更新节点
    updateProps(vnode, oldVnode.data)
  }
}

export function createElm(vnode) {
  const { tag, children, key, data, text } = vnode;
  if (typeof tag === "string") {
    vnode.el = document.createElement(tag);

    updateProps(vnode);

    children.forEach((child) => {
      // 遍历儿子将儿子渲染出的结果渲染到父亲中
      vnode.el.appendChild(createElm(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

function updateProps(vnode, oldProps={}) {
  const el = vnode.el;
  const newProps = vnode.data || {};

  // 老的有新的没有 需要删除属性
  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key)
    }
  }

  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}
  // 老的样式中有  新的没有 删除老的
  for(let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }

  // 新的有 那就那就直接去更新即可
  for (let key in newProps) {
    if (key === "style") {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if (key === "class") {
      el.className = newProps.class;
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}
