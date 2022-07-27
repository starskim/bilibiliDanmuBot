const logger = require('../local/logger')
const {
    saveNewRedPacketInfo, pushUserJoinRedPacketEvent, pushWinnerUsersToRedPacketEvent,
    updateRedPacketUserAmount
} = require("../database/redpacket");
const {getAwardMessage, cacheAwardMessage} = require("../cache/award");
const {pushUserJoinAnchorEvent, updateAnchorUserAmount} = require("../database/anchor");


/**
 * 在新红包事件开始时保存对应数据到数据库
 * @param info {{
  "cmd": String,
  "data": {
    "lot_id": Number,
    "sender_uid": Number,
    "sender_name": String,
    "sender_face": String,
    "join_requirement": Number,
    "danmu": String,
    "current_time": Number,
    "start_time": Number,
    "end_time": Number,
    "last_time": Number,
    "remove_time": Number,
    "replace_time": Number,
    "lot_status": Number,
    "h5_url":String,
    "user_status": Number,
    "awards": [
      {
        "gift_id": Number,
        "gift_name":String,
        "gift_pic": String,
        "num": Number
      }
    ],
    "lot_config_id": Number,
    "total_price": Number,
    "wait_num": Number
  }
}} 红包实例信息
 * @param room {Number} 房间号
 * @returns {Promise<void>}
 */
const processRedPacketStart = async (info, room) => {
    //缓存红包信息到redis中
    await cacheAwardMessage(room, JSON.stringify({
        message: info.data.danmu,
        type: 'redPacket',
        hash: info.data.lot_id
    }), info.data.last_time)

    //构建要保存到数据中的Document
    try {
        const awards = []
        for (let i = 0; i < info.data.awards.length; i++) {
            const gift = {
                id: info.data.awards[i].gift_id,
                name: info.data.awards[i].gift_name,
                pic: info.data.awards[i].gift_pic,
                amount: info.data.awards[i].num
            }
            awards.push(gift)
        }
        const redPacketInfo = {
            room: room,
            hash: info.data.lot_id,
            price: info.data.total_price,
            message: info.data.danmu,
            amount: 0,
            senderInfo: {
                uid: info.data.sender_uid,
                name: info.data.sender_name,
                face: info.data.sender_face
            },
            gifts: awards,
            winners: [],
            users: [],
            time: {
                start: new Date(info.data.start_time * 1000),
                end: new Date(info.data.end_time * 1000)
            }
        }
        logger.redPacket(`User ${info.data.sender_name} sends a packet worth ${info.data.total_price} in room ${room}, and there are ${info.data.wait_num} remain.`)
        const res = await saveNewRedPacketInfo(redPacketInfo)
        if (res.status === false) {
            logger.warn(`An error occurred when saving redPacket info to database, message:${res.message}`)
        }
    } catch (e) {
        logger.warn(`An error occurred when saving redPacket info, message:${e.message}`)
    }
}

/**
 * 处理红包/天选事件事件操作
 * @param room {number} 房间号
 * @param message {string} 消息
 * @param uid {Number} 用户uid
 * @returns {Promise<void>}
 */
const processRedPacketOrAnchorJoin = async (room, message, uid) => {
    try {
        const res = JSON.parse(await getAwardMessage(room))
        if (res === null || message !== res.message) {
            return
        }
        if (res.type === 'anchor') {
            const operationRes = await pushUserJoinAnchorEvent({uid: uid, hash: res.hash})
            if (operationRes.status === false) {
                logger.warn(`An error occurred when saving anchor update to database, message:${operationRes.message}`)
            }
            return
        }
        if (res.type === 'redPacket') {
            const operationRes = await pushUserJoinRedPacketEvent(uid, res.hash)
            if (operationRes.status === false) {
                logger.warn(`An error occurred when saving redPacket update to database, message:${operationRes.message}`)
            }
        }
    } catch (e) {
        logger.warn(`An error occurred when saving redPacket/anchor update, message:${e.message}`)
    }
}


/**
 *
 * @param info {{
  "cmd": String,
  "data": {
    "lot_id": Number,
    "total_num": Number,
    "winner_info": array,
    "awards": {Object},
    "version": Number
  }
}}
 * @returns {Promise<void>}
 */
const processRedPacketEnd = async (info) => {
    try {
        const userList = []
        for (let i = 0; i < info.data.winner_info.length; i++) {
            const userInfo = {
                uid: info.data.winner_info[i][0],
                name: info.data.winner_info[i][1],
                serialId: info.data.winner_info[i][2],
                giftId: info.data.winner_info[i][3]
            }
            userList.push(userInfo)
        }
        const res = await pushWinnerUsersToRedPacketEvent(userList, info.data.lot_id)
        if (res.status === false) {
            logger.warn(`An error occurred when saving redPacket winners to database, message:${res.message}`)
        }
    } catch (e) {
        logger.warn(`An error occurred when saving redPacket winners, message:${e.message}`)
    }
}


/**
 *
 * @param info {{
 *   "cmd": String,
 *   "data": {
 *     "activity_identity": String,
 *     "activity_source": Number,
 *     "aggregation_cycle": Number,
 *     "aggregation_icon": String,
 *     "aggregation_num": Number,
 *     "dmscore": Number,
 *     "msg": String,
 *     "show_rows": Number,
 *     "show_time": Number,
 *     "timestamp": Number
 *   }
 * }} 事件信息
 * @param room {Number} 房间号
 * @returns {Promise<void>}
 */
const processRedPacketOrAnchorAggregation = async (info, room) => {
    try {
        const res = JSON.parse(await getAwardMessage(room))
        if (res === null) {
            return
        }
        if (res.type === 'anchor') {
            const operationResult = await updateAnchorUserAmount(res.hash, info.data.aggregation_num)
            if (operationResult.status === false) {
                logger.warn(`An error occurred when saving anchor update to database, message:${res.message}`)
            }
        }
        if (res.type === 'redPacket') {
            const operationResult = await updateRedPacketUserAmount(res.hash, info.data.aggregation_num)
            if (operationResult.status === false) {
                logger.warn(`An error occurred when saving redPacket update to database, message:${res.message}`)
            }
        }
    } catch (e) {
        logger.warn(`An error occurred when saving redPacket/anchor update, message:${e.message}`)
    }
}

module.exports = {
    processRedPacketStart,
    processRedPacketOrAnchorJoin,
    processRedPacketEnd,
    processRedPacketOrAnchorAggregation
}