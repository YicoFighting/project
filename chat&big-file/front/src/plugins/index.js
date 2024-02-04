import indent from './indent';
const install = (app) => {
  app.directive('indent', indent);
};

export default install;
