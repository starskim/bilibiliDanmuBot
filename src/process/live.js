const logger = require('../local/logger')
const fs = require('fs')
const path = require('path')
const {processDanmuMessage} = require("./danmu");
const {processGiftMessage} = require("./gift");
const {cacheOnlineMessage} = require("../cache/online");
const {cacheLiveMessage} = require("../cache/live");
const {processBlockMessage} = require("./block");
const {processRoomSilentOperation} = require("./silent");
const {processInteractMessage} = require("./interact");
const {
    processRedPacketStart,
    processRedPacketEnd,
    processRedPacketOrAnchorJoin, processRedPacketOrAnchorAggregation
} = require("./redpacket");
const {processNewGuardInfo} = require("./guard");
const {processWatchUpdate} = require("./watch");
const {processAnchorStart, processAnchorResult} = require("./anchor");
const {saveAllEvent} = require("../database/test");
const {processNoticeMessage} = require("./notice");
const {processBattleStart, processBattleProgressInfo, processBattleResult, processBattleAssistInfo} = require("./battle");

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
        await saveAllEvent(JSON.stringify(message.info))
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
                console.log(message.info)
                break
            case 'POPULARITY_RED_POCKET_WINNER_LIST': //红包赢家列表报告
                await processRedPacketEnd(message.info)
                break

            case 'DANMU_AGGREGATION':  //红包or天选被参与一次
                //NOTE：这个方法无法成功同步每一次加入,故废弃,仅用于参与人数校准
                await processRedPacketOrAnchorAggregation(message.info,message.room)
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
                await processBattleStart(message.info,message.room)
                break

            case 'PK_BATTLE_PROCESS': //PK大乱斗比分情况变更
                await processBattleProgressInfo(message.info,message.room)
                break

            case 'PK_BATTLE_SETTLE_USER': //PK大乱斗结束
                await processBattleResult(message.info,message.room)
                break

            case 'PK_BATTLE_SETTLE_V2': //PK大乱斗结束,携带本次乱斗基本信息
                await processBattleAssistInfo(message.info,message.room)
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


module.exports = {
    processOnlineMessage,
    processLiveMessage
}