const logger = require('../../local/logger')
const config = require('../../local/config')
const fs = require('fs')
const path = require('path')
const {processDanmuMessage} = require("./process/danmu");
const {processGiftMessage} = require("./process/gift");
const {cacheLiveMessage} = require("./cache/live");
const {processBlockMessage} = require("./process/block");
const {processRoomSilentOperation} = require("./process/silent");
const {processInteractMessage} = require("./process/interact");
const {
    processRedPacketStart,
    processRedPacketEnd,
    processRedPacketOrAnchorJoin,
    processRedPacketOrAnchorAggregation
} = require("./process/redpacket");
const {processNewGuardInfo} = require("./process/guard");
const {processWatchUpdate} = require("./process/watch");
const {processAnchorStart, processAnchorResult} = require("./process/anchor");
const {processNoticeMessage} = require("./process/notice");
const {
    processBattleStart,
    processBattleProgressInfo,
    processBattleResult,
    processBattleAssistInfo
} = require("./process/battle");
const {connectToDatabase} = require("./database/init");
const {processSuperChatDeletion, processSuperChatJpn, processSuperChatSends} = require("./process/superChat");

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
 * 处理客户端发过来的所有直播消息,进行去重后转交下级处理程序
 * @param message {Object} 直播消息
 * @param client {string} 客户端唯一编号
 * @returns {Promise<void>}
 */
const processLiveMessage = async (message, client) => {
    try {
        const cacheRes = await cacheLiveMessage(JSON.stringify(message.info), 10)
        if (cacheRes) {
            return
        }
        //await fs.writeFileSync(path.resolve(`./template/${message.info.cmd}.json`),JSON.stringify(message.info))
        switch (message.info.cmd) {
            case 'DANMU_MSG': //弹幕消息
                await processDanmuMessage(message.info, message.room)
                await processRedPacketOrAnchorJoin(message.room, message.info.info[1], message.info.info[2][0])//处理可能存在的红包事件
                break

            case 'SEND_GIFT': //礼物发送消息
                await processGiftMessage(message.info, message.room)
                break

            case 'ROOM_BLOCK_MSG': //用户被某个房间封禁
                await processBlockMessage(message.info, message.room)
                break

            case 'ROOM_SILENT_ON': //房间禁言开启
                await processRoomSilentOperation(message.info, message.room)
                break

            case 'ROOM_SILENT_OFF': //房间禁言关闭
                await processRoomSilentOperation(message.info, message.room)
                break

            case 'INTERACT_WORD':  //房间进入or交互信息
                await processInteractMessage(message.info, message.room)
                break

            case 'PREPARING': //直播结束
                //TODO: 查询数据库并决定是否关闭该直播间的监听
                break
            case 'POPULARITY_RED_POCKET_WINNER_LIST': //红包赢家列表报告
                await processRedPacketEnd(message.info)
                break

            case 'DANMU_AGGREGATION':  //红包or天选被参与一次
                //NOTE：这个方法无法成功同步每一次加入,故废弃,仅用于参与人数校准
                await processRedPacketOrAnchorAggregation(message.info, message.room)
                break
            case 'GUARD_BUY'://新舰长
                await processNewGuardInfo(message.info, message.room)
                break

            case 'POPULARITY_RED_POCKET_START': //开始红包抽奖
                await processRedPacketStart(message.info, message.room)
                break

            case 'NOTICE_MSG': //通知信息
                await processNoticeMessage(message.info)
                break

            case 'WATCHED_CHANGE': //观看人数更新
                await processWatchUpdate(message.info, message.room)
                break

            case 'ANCHOR_LOT_START': //天选抽奖开始
                await processAnchorStart(message.info, message.room)
                break

            case 'ANCHOR_LOT_AWARD': //天选抽奖结果发送
                await processAnchorResult(message.info)
                break

            case 'PK_BATTLE_START_NEW': //PK大乱斗开始
                await processBattleStart(message.info, message.room)
                break

            case 'PK_BATTLE_PROCESS': //PK大乱斗比分情况变更
                await processBattleProgressInfo(message.info, message.room)
                break

            case 'PK_BATTLE_SETTLE_USER': //PK大乱斗结束
                await processBattleResult(message.info, message.room)
                break

            case 'PK_BATTLE_SETTLE_V2': //PK大乱斗结束,携带本次乱斗基本信息
                await processBattleAssistInfo(message.info, message.room)
                break

            case 'SUPER_CHAT_MESSAGE_DELETE'://SC被管理员删除等
                await processSuperChatDeletion(message.info)
                break

            case 'SUPER_CHAT_MESSAGE_JPN'://SC小日子过得不错的日本语
                await processSuperChatJpn(message.info)
                break

            case 'SUPER_CHAT_MESSAGE': //SC发送
                await processSuperChatSends(message.info, message.room)
                break


            default:
                if (fs.existsSync(path.resolve(`./template/${message.info.cmd}.json`)) === false) {
                    await fs.writeFileSync(path.resolve(`./template/${message.info.cmd}.json`), JSON.stringify(message.info))
                }
                break
        }
    } catch (e) {
        logger.warn(`An error occurred during live message processing,message:${e.message}`)
    }
}


module.exports = async (workerInfos) => {
    //对数据库进行持久化连接,以避免多次重连数据库导致的性能开销
    await initDatabaseConnection()
    await processLiveMessage(workerInfos.info, workerInfos.client)
}