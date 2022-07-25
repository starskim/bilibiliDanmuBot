const {Server} = require('socket.io')
const config = require('../local/config')
const logger = require('../local/logger')
const path = require('path');
const Piscina = require('piscina');



const io = new Server(config.get('basic.socketPort'), {
    pingTimeout: 5000, //超时时间
    pingInterval: 3000
})

io.httpServer.on('error', err => {
    logger.error(`There is an error occurred when starting socket server\n${err.message}`)
    process.exit(10001)
})

const liveMessageWorker = new Piscina({
    filename: path.resolve(__dirname, '../workers/live.js'),
    idleTimeout:10000,
    concurrentTasksPerWorker:3,
    minThreads:4
});

const onlineMessageWorker = new Piscina({
    filename: path.resolve(__dirname, '../workers/online.js'),
    idleTimeout:10000,
    concurrentTasksPerWorker:3,
    minThreads:4
});


io.on('connection', async socket => {

    logger.info(`Remote client ${socket.id} has connected.`)

    socket.on('ROOM_MSG', async msg => {
        await liveMessageWorker.run({info:msg,client:socket.client.id})
    })

    socket.on('ROOM_ONLINE', async online => {
        await onlineMessageWorker.run({info:online,client:socket.client.id})
    })

    socket.on('disconnect',reason => {
        logger.info(`Remote client ${socket.id} has disconnected by ${reason}.`)
    })
})
