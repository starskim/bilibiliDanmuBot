const {Server} = require("socket.io");
const config = require("./src/local/config");

const io = new Server(config.get('basic.socketPort'), {
    pingTimeout: 5000, //超时时间
    pingInterval: 3000
})


setInterval(()=>{
    io.sockets.serverSideEmit('1')
},1000)