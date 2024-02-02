function addWaterMarker(parentNode, attribute) {
  const { text, font, textColor } = attribute;
  // 水印文字，父元素，字体，文字颜色
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 150;

  const ctx = canvas.getContext("2d");
  ctx.rotate((-20 * Math.PI) / 180);
  ctx.font = font || "12px Microsoft JhengHei";
  ctx.fillStyle = textColor || "rgba(180, 180, 180, 0.5)";
  ctx.textAlign = "left";
  ctx.textBaseline = "Middle";
  ctx.fillText(text, canvas.width / 10, canvas.height / 2);

  parentNode.style.backgroundImage =
    "url(" + canvas.toDataURL("image/png") + ")";
}

const waterMarker = {
  created: function (el, binding) {
    addWaterMarker(el, binding.value);
  },
};

export default waterMarker;
