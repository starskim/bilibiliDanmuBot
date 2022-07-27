const {Server} = require('socket.io')
const {cronJobTrigger} = require('../service/trigger')
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
        const wc = new MessageChannel()
        await clientMessageWorker.run({
            type: 'CLIENT_REGISTER',
            client: socket.id,
            data: info,
            port: wc.port1
        }, {transferList: [wc.port1]})
        wc.port2.onmessage = (res) => {
            processClientProcessEvent(res.data)
        }
    })

    socket.on('MISSION_ACCEPT', async (missionInfo) => {
        const wc = new MessageChannel()
        await clientMessageWorker.run({
            type: 'MISSION_ACCEPT',
            client: socket.id,
            data: missionInfo,
            port: wc.port1
        }, {transferList: [wc.port1]})
        wc.port2.onmessage = (res) => {
            processClientProcessEvent(res.data)
        }
    })

    socket.on('disconnect', async reason => {
        logger.info(`Remote client ${socket.id} has disconnected by ${reason}.`)
        await clientMessageWorker.run({type: 'CLIENT_DISCONNECT', client: socket.id})
    })
})

/**
 * 处理客户端对应worker的处理过程中,emit的数据
 * @param ev {any}
 * @returns {Promise<void>}
 */
const processClientProcessEvent = async (ev) => {
    switch (ev.type) {
        case 'REGISTER_SUCCESS':
            io.in(ev.client).emit(ev.type, ev.data)
            break
    }
}


//定时任务-发布所有任务
cronJobTrigger.on('MISSION_DEPLOY', async () => {
    console.log(`MISSION_DEPLOY`)
})


//定时任务-创建任务-从B站直播首页抓取所有直播间
cronJobTrigger.on('GET_ROOM_FROM_INDEX', async () => {
    console.log('GET_ROOM_FROM_INDEX')
})