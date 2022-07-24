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

io.on('connection', async socket => {
    logger.info(`Remote client ${socket.id} has connected.`)

    socket.on('ROOM_MSG', async msg => {
        await processLiveMessage(msg, socket.client.id)
    })

    socket.on('ROOM_ONLINE', async online => {
        await processOnlineMessage(online, socket.client.id)
    })
})
