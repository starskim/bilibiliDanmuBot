const {Server} = require('socket.io')
const { cronJobTrigger } = require('../service/trigger')
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
    filename: path.resolve(__dirname, '../workers/live/index.js'),
    idleTimeout: 10000,
    concurrentTasksPerWorker: 3,
    minThreads: 4
});

const onlineMessageWorker = new Piscina({
    filename: path.resolve(__dirname, '../workers/online/index.js'),
    idleTimeout: 10000,
    concurrentTasksPerWorker: 3,
    minThreads: 4
});

const clientMessageWorker = new Piscina({
    filename: path.resolve(__dirname, '../workers/client/index.js'),
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
        await clientMessageWorker.run({type: 'CLIENT_REGISTER', client: socket.id, data: info})
    })

    socket.on('MISSION_ACCEPT',async (missionInfo)=>{
        await clientMessageWorker.run({type:'MISSION_ACCEPT',client:socket.id,data:missionInfo})
    })

    socket.on('disconnect', async reason => {
        logger.info(`Remote client ${socket.id} has disconnected by ${reason}.`)
        await clientMessageWorker.run({type: 'CLIENT_DISCONNECT', client: socket.id})
    })
})

//定时任务-任务发布通知
cronJobTrigger.on('MISSION_DEPLOY',async ()=>{
    console.log(`MISSION_DEPLOY`)
})

cronJobTrigger.on('GET_ROOM_FROM_INDEX',async ()=>{
    console.log('GET_ROOM_FROM_INDEX')
})