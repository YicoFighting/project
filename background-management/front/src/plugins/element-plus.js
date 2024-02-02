import { ElMessage } from "element-plus";

let messageInstance = null;
const resetMessage = {};

const singleton = (options) => {
  if (messageInstance) {
    messageInstance.close();
  }
  messageInstance = ElMessage(options);
  return messageInstance;
};

["error", "success", "info", "warning"].forEach((type) => {
  resetMessage[type] = (options) => {
    if (typeof options == "string") {
      options = {
        message: options,
        duration: 0,
      };
    }
    options.type = type;
    return singleton(options);
  };
});

export default resetMessage;
