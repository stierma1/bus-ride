
let EventEmitter = require("events");
let uuid = require("uuid");

class Bus extends EventEmitter {
  constructor(){
    super();
    this.timeout = null;
  }
  
  emit(event, ...rest){
    if(event !== "log" && event !== "telemetry"){
      super.emit("log", {emitter: "bus", event, message:"Event emitted"});
    }
    super.emit(event, ...rest);
  }
  
  requestResponse(toService, params){
    const returnService = "return:" + uuid.v4();
    this.emit("log", {emitter: "bus", returnService, toService, message:"Request received"});
    let start = Date.now();
    let p = new Promise((res, rej) => {
      this.once(returnService, (err, data) => {
        if(err){
          this.emit("telemetry", {emitter: "bus", status:"errror", returnService, toService, params, time:Date.now() - start});
          this.emit("log", {emitter: "bus", status:"error", returnService, toService, params, error:err})
          rej(err);
        } else {
          this.emit("telemetry", {emitter: "bus", status:"success", returnService, toService, params, time:Date.now() - start});
          this.emit("log", {emitter: "bus", status:"success", returnService, toService, params})
          res(data);
        }
      });
    });
    if(this.timeout !== null){
      setTimeout(() => {
        this.emit(returnService, new Error("Timeout reached"));
      }, this.timeout);
    }
    this.emit(toService, returnService, params);
    return p; 
  }
  
  setRequestTimeout(timeout){
    this.timeout = timeout;
  }
}

module.exports = new Bus();