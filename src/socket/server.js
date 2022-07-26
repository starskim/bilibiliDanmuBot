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
    idleTimeout: 10000,
    concurrentTasksPerWorker: 3,
    minThreads: 4
});

const onlineMessageWorker = new Piscina({
    filename: path.resolve(__dirname, '../workers/online.js'),
    idleTimeout: 10000,
    concurrentTasksPerWorker: 3,
    minThreads: 4
});

const clientMessageWorker = new Piscina({
    filename: path.resolve(__dirname, '../workers/client.js'),
    idleTimeout: 10000,
    concurrentTasksPerWorker: 3,
    minThreads: 4
});


io.on('connection', async socket => {
    logger.info(`Remote client ${socket.id} has connected.`)
    socket.emit('REQUIRE_REGISTER')

    socket.on('ROOM_MSG', async msg => {
        await liveMessageWorker.run({info: msg, client: socket.id})
    })

    socket.on('ROOM_ONLINE', async online => {
        await onlineMessageWorker.run({info: online, client: socket.id})
    })

    socket.on('CLIENT_REGISTER', async info => {
        const res = await clientMessageWorker.run({type: 'CLIENT_REGISTER', client: socket.id, data: info})
        if (res.event !== undefined) {
            socket.emit(res.event, res.args)
        }
    })

    socket.on('disconnect', async reason => {
        logger.info(`Remote client ${socket.id} has disconnected by ${reason}.`)
        await clientMessageWorker.run({type: 'CLIENT_DISCONNECT', client: socket.id})
    })
})