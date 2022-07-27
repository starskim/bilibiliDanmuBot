const {cacheOnlineMessage} = require("./cache/online");
const logger = require("../../local/logger");
const config = require("../../local/config");
const {connectToDatabase} = require("../live/database/init");
let isConnected = false
connectToDatabase(config.get('database.mongoDB')).then((res) => {
    if (res.status === true) {
        isConnected = true
    } else {
        logger.warn(res.message)
        process.exit(100044)
    }
})



/**
 * 处理客户端发来的直播在线消息
 * @param message {{type:string,room:Number,online:Number}} 在线消息
 * @param client {string} 客户端唯一编号
 * @returns {Promise<void>}
 */
const processOnlineMessage = async (message, client) => {
    try {
        const cacheResult = await cacheOnlineMessage(JSON.stringify(message), 10)
        if (cacheResult) {
            return
        }
        logger.debug(`Room ${message.room} now has ${message.online} viewers online.`)
    } catch (e) {
        logger.warn(`An error occurred during online message processing, message:${e.message}`)
    }
}

module.exports = async (workerInfo) => {
    while (isConnected === false) {
        await new Promise(resolve => {
            setTimeout(resolve, 100)
        })
    }
    await processOnlineMessage(workerInfo.info, workerInfo.client)
}
