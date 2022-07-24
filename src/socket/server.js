const {Server} = require('socket.io')
const config = require('../local/config')
const logger = require('../local/logger')
const {processOnlineMessage, processLiveMessage} = require("../process/live");
const io = new Server(config.get('basic.socketPort'), {
    pingTimeout: 5000, //超时时间
    pingInterval: 3000
})

io.httpServer.on('error', err => {
    logger.error(`There is an error occurred when starting socket server\n${err.message}`)
    process.exit(10001)
})

let counter = 0
let time = 0
let iops = 0

setInterval(()=>{
    console.log('\n\nNet work QPS:'+ counter)
    console.log('Process time consumed:'+ time+"ms")
    console.log(`System PPS:${iops}`)
    counter = 0
    iops = 0
},1000)

io.on('connection', async socket => {

    logger.info(`Remote client ${socket.id} has connected.`)

    socket.on('ROOM_MSG', async msg => {
        counter++
        let date = Date.now()
        await processLiveMessage(msg, socket.client.id)
        time = Date.now() - date
        iops++
    })

    socket.on('ROOM_ONLINE', async online => {
        await processOnlineMessage(online, socket.client.id)
    })

    socket.on('disconnect',reason => {
        logger.info(`Remote client ${socket.id} has disconnected by ${reason}.`)
    })
})
