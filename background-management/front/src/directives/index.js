import copy from "./copy";
import longpress from "./longpress";
import debounce from "./debounce";
import lazyLoad from "./lazyLoad";
import waterMarker from "./waterMarker";
import draggable from "./draggable";
import showTooltip from "./showTooltip";
import tooltip from "./tooltip";

const install = (app) => {
  app.directive("copy", copy);
  app.directive("longpress", longpress);
  app.directive("debounce", debounce);
  app.directive("lazyLoad", lazyLoad);
  app.directive("waterMarker", waterMarker);
  app.directive("draggable", draggable);
  app.directive("showTooltip", showTooltip);
  app.directive("tooltip", tooltip);
};

export default install;
