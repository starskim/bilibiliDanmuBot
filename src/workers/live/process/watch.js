const {saveWatchInfo} = require("../database/watch");
const logger = require('../local/logger')

/**
 * 处理房间观看人数更新消息
 * @param info {{
 *   "cmd": String,
 *   "data": {
 *     "num": Number,
 *     "text_small": String,
 *     "text_large": String
 *   }
 * }} 更新信息
 * @param room {Number} 房间号
 * @returns {Promise<void>}
 */
const processWatchUpdate = async (info, room) => {
    try {
        const amountInfo = {
            room: room,
            amount: info.data.num
        }
        const res = await saveWatchInfo(amountInfo)
        if (res.status === false) {
            logger.warn(`An error occurred when saving watch amount update to database, message:${res.message}`)
        }
    } catch (e) {
        logger.warn(`An error occurred when saving watch amount update, message:${e.message}`)
    }
}

module.exports = {
    processWatchUpdate
}
