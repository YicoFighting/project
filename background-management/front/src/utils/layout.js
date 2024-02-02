const setClass = (element, className) => {
  document.querySelector(element).classList.add(className);
};

const removeClass = (element, className) => {
  document.querySelector(element).classList.remove(className);
};

export { setClass, removeClass };
