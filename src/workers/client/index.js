const logger = require("./local/logger");
const config = require("./local/config");
const {connectToDatabase} = require("./database/init");
const {processNewClientRegister, processClientDisconnect} = require("./process/connection");
const {processClientAcceptMission, processMissionDeploy, processRoomAddFromIndex} = require("./process/mission");
let isConnected = false


const initDatabaseConnection = async () => {
    let counter = 0
    do {
        const res = await connectToDatabase(config.get('database.mongoDB'))
        if (res.status === true) {
            isConnected = true
        } else {
            logger.warn(`An error occurred connecting to database:${res.message}`)
            counter++
        }
    } while (isConnected === false || counter > 3)
    if (isConnected === false) {
        process.exit(10003)
    }
}


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

        case 'MISSION_DEPLOY': //发布所有缓存中的任务到客户端
            await processMissionDeploy(info.port)
            break

        case 'GET_ROOM_FROM_INDEX': //添加从B站直播首页抓取房间号的任务
            await processRoomAddFromIndex()
            break

    }
}


module.exports = async (workerInfo) => {
    await initDatabaseConnection()
    return await processClientMessage(workerInfo)
}