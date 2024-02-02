export const useDrag = (list) => {
  let dragIndex = 0;
  // dragstart 事件在用户开始拖动元素或被选择的文本时调用。
  const dragstart = (event, index) => {
    event.stopPropagation();
    dragIndex = index;
    // 开始移动时,将原来的透明度设为0
    // 不能使用nextTick
    setTimeout(() => {
      //   event.target.classList.add("moving");
      event.target.style.opacity = 0;
    }, 0);
  };
  // dragenter 事件在可拖动的元素或者被选择的文本进入一个有效的放置目标时触发。
  // 目标对象是用户直接选择的范围（由用户直接指示作为放置目标的元素）, 或者 <body> 元素。
  const dragenter = (event, index) => {
    event.preventDefault();
    // 拖拽到原位置时不触发
    if (dragIndex !== index) {
      // 拿到当前位置的数据
      const source = list.value[dragIndex];
      // 从dragIndex位置开始,截取一位
      list.value.splice(dragIndex, 1);
      // 从index位置 插入一位
      list.value.splice(index, 0, source);
      // 更新节点位置
      dragIndex = index;
    }
  };

  //  dragover 事件在可拖动的元素或者被选择的文本被拖进一个有效的放置目标时（每几百毫秒）触发。
  // 该事件在放置目标上触发。
  const dragover = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };
  // dragend 事件在拖放操作结束时触发（通过释放鼠标按钮或单击 escape 键）。
  // 该事件无法取消。
  const dragend = (event) => {
    event.target.style.opacity = 1;
  };
  return { dragstart, dragenter, dragover, dragend };
};
