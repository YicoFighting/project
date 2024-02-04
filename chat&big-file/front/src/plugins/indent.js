const indent = {
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode, prevVnode) {
    if (el.offsetHeight > 18) {
      el.parentNode.style.textIndent = '2em';
    }
  },
};

export default indent;
