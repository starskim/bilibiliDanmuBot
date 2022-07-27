const db = require('./src/workers/live/database/db')
const mongoose = require('mongoose')
const logger = require('./src/local/logger')
const { Manager } = require('socket.io-client')
const manager = new Manager('ws://127.0.0.1:3000',{
    reconnectionAttempts:Infinity,
    reconnectionDelay:5000
})
const socket = manager.socket('/')

const connectToDatabase = async (url) => {
    try {
        // noinspection JSUnresolvedFunction
        await mongoose.connect(url, {
            bufferCommands: false
        })
        return {status: true, message: `连接到数据库成功`}
    } catch (e) {
        return {status: false, message: e.message}
    }
}


socket.io.on('reconnect_attempt',attempt => {
    logger.info(`Connection lost, trying reconnect, attempt ${attempt} times`)
})

socket.io.on('reconnect_error',err => {
    logger.info(`Reconnect failed, error: ${err.message}`)
})

socket.io.on('reconnect',attempt => {
    logger.info(`Reconnect success, times of attempt: ${attempt}`)
})

socket.io.on('close',reason => {
    logger.info(`Connection closed, reason:${reason}`)
})

socket.io.on('ping',()=>{
    logger.debug(`Received server keepalive.`)
})



const sendMockData = async ()=>{
    const res = await connectToDatabase('mongodb://localhost:27017/biliDashBoard')
    console.log(res)
    const count = await db.test.count().exec()
    const times = Math.floor(count / 100 )
    for (let i = 0; i < times; i++) {
        const list = await db.test.find().limit(100).skip(i * 100).sort({_id:-1}).exec()
        for (let j = 0; j < list.length; j++) {
            await socket.emit('ROOM_MSG',{room:195909,info:JSON.parse(list[j].info)})
        }
    }
}

sendMockData().then()