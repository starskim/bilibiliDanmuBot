const logger = require("./local/logger");
const config = require("./local/config");
const {connectToDatabase} = require("../live/database/init");
const {processNewClientRegister, processClientDisconnect} = require("./process/connection");
const {processClientAcceptMission} = require("./process/mission");
let isConnected = false

connectToDatabase(config.get('database.mongoDB')).then((res) => {
    if (res.status === true) {
        isConnected = true
    } else {
        logger.warn(`An error occurred connecting to database:${res.message}`)
        process.exit(100044)
    }
})

/**
 * 处理客户端事件
 * @param info {{
 *     type:String,
 *     client:String,
 *     data:any,
 *     port:MessagePort
 * }}
 * @returns {Promise<{event: string ,args:any?}>}
 */

const processClientMessage = async (info) => {

    switch (info.type) {
        case 'CLIENT_REGISTER': //客户端提交注册信息
            await processNewClientRegister(info.data, info.port)
            break

        case'CLIENT_DISCONNECT': //客户端断开连接(无论原因)
            await processClientDisconnect(info.client)
            //TODO:删除该客户端的所有已连接房间
            break

        case 'MISSION_ACCEPT': //客户端接受任务
            await processClientAcceptMission(info.data, info.client)
            break
    }
}


module.exports = async (workerInfo) => {
    while (isConnected === false) {
        await new Promise(resolve => {
            setTimeout(resolve, 100)
        })
    }
    return await processClientMessage(workerInfo)
}