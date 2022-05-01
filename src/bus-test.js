
let bus = require("./bus");

bus.on("log", ({toService, status, event, error, message}) => {
  console.log({toService, status, event, error, message});
});
bus.on("telemetry", ({toService, returnService, status, time}) => {
  console.log({toService, returnService, status, time})
});
bus.on("test", (returnService) => {
  setTimeout(() => {
    bus.emit(returnService);
  }, 200)
});
bus.on("slowtest", (returnService) => {
  setTimeout(() => {
    bus.emit(returnService);
  }, 500)
});

bus.requestResponse("test").then(() => {});
bus.setRequestTimeout(300);
bus.requestResponse("slowtest").catch(() => {});