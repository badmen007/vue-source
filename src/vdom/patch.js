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
    let el = vnode.el = oldVnode.el

    // 更新属性，用新的虚拟节点属性和老的比较 去更新节点
    updateProps(vnode, oldVnode.data)

    const oldChildren = oldVnode.children || []
    const newChildren = vnode.children || []
    if (oldChildren.length > 0 && newChildren.length > 0) {
      // 老的有儿子 新的也有儿子
      updateChildren(oldChildren, newChildren, el)
    } else if(oldChildren.length > 0) {
      // 老的有 新的没有
      el.innerHTML = ''
    } else if (newChildren.length > 0) {
      // 新的有 老的没有
      for(let i = 0; i < newChildren.length; i++) {
        const child = newChildren[i]
        el.appendChild(createElm(child))
      }
    }
    // 儿子的比较分为一下几种情况
    // 老的有儿子 新的没儿子
    // 老的没儿子，新的有儿子

    // 老的有儿子 新的有儿子 diff算法
  }
}

function isSameVnode(oldVnode, newVnode) {
  return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
}

// 比对儿子
function updateChildren(oldChildren, newChildren, parent) {
  // vue中的diff算法做了很多优化
  // DOM有很多常见的逻辑 
  // vue2中采用的是双指针
  let oldStartIndex = 0
  let oldStartVnode = oldChildren[oldStartIndex];
  let oldEndIndex = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndIndex]

  let newStartIndex = 0;
  let newStartVnode = newChildren[newStartIndex];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newEndIndex];

  function makeIndexByKey(children) {
    let map = {}
    children.forEach((item, index) => {
      if (item.key) {
        map[item.key] = index
      }
    })
    return map
  }
  const map = makeIndexByKey(oldChildren)
  // 比较谁先循环停止
  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex]
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex]
    } else if(isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode, newEndVnode);
      // 插入到尾部下一个的前面
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldEndVnode, newStartVnode)) { 
      // 老的尾和新的头
      patch(oldEndVnode, newStartVnode);
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else {
      // 儿子之间没关系 暴力比对
      let moveIndex = map[newStartVnode.key]

      if (moveIndex == undefined) { // 说明没用能够服用的
        parent.insertBefore(createElm(newStartVnode),oldStartVnode.el)
      } else {
        let moveVnode = oldChildren[moveIndex];
        // 用来占位 最后再删除
        oldChildren[moveIndex] = null
        parent.insertBefore(moveVnode, oldStartVnode.el);
        patch(moveVnode, newStartVnode)
      }
      newStartVnode = newChildren[++newStartIndex]
    }

    // 反转节点 头部移动到尾部 尾部移动到头部
  }
  if (newStartIndex <= newEndIndex) { 
    // 新的多的要插入到父亲中
    for(let i = newStartIndex; i <= newEndIndex; i++) {
      // 可能是向前添加也可能是向后添加
      // 向后添加的话 ele == null
      // 否则就是向前添加 因为向前的话 newEndIndex是往前的
      let ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
      parent.insertBefore(createElm(newChildren[i]), ele)
    }
  }
  // 老的节点还有没处理的就删掉
  if (oldStartIndex <= oldEndIndex) {
    for(let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = children[i]
      if (child != undefined) {
        parent.removeChild(child.el)
      }
    }
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
