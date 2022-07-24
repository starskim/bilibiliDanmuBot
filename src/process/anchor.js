const logger = require('../local/logger')
const {saveAnchorStart, saveAnchorResult} = require("../database/anchor");
const {cacheAwardMessage} = require("../cache/award");


/**
 *
 * @param info {{
 *   "cmd": String,
 *   "data": {
 *     "award_dont_popup": Number,
 *     "award_image": String,
 *     "award_name": String,
 *     "award_num": Number,
 *     "award_type": Number,
 *     "award_users": [
 *       {
 *         "uid": Number,
 *         "uname": String,
 *         "face":String,
 *         "level": Number,
 *         "color": Number,
 *         "num": Number
 *       }
 *     ],
 *     "id": Number,
 *     "lot_status": Number,
 *     "url": String,
 *     "web_url": String
 *   }
 * }}
 * @returns {Promise<void>}
 */
const processAnchorResult = async (info) => {
    try {
        /**
         * @type {[{
         *         "uid": Number,
         *         "uname": String,
         *         "face":String,
         *         "level": Number,
         *         "amount": Number
         *       }]}
         */
        const winnerList = []
        for (let i = 0; i < info.data.award_users.length; i++) {
            winnerList.push({
                uid: info.data.award_users[i].uid,
                uname: info.data.award_users[i].uname,
                face: info.data.award_users[i].face,
                level: info.data.award_users[i].level,
                amount: info.data.award_users[i].num
            })
        }
        const anchorResult = {
            hash: info.data.id,
            winners: winnerList
        }
        const res = await saveAnchorResult(anchorResult)
        if (res.status === false) {
            logger.warn(`An error occurred when saving anchor result to database, message:${res.message}`)
        }
    } catch (e) {
        logger.warn(`An error occurred when saving anchor result, message:${e.message}`)
    }
}


/**
 *
 * @param info {{
 *   "cmd": String,
 *   "data": {
 *     "asset_icon": String,
 *     "award_image": String,
 *     "award_name": String,
 *     "award_num": Number,
 *     "award_type": Number,
 *     "cur_gift_num": Number,
 *     "current_time": Number,
 *     "danmu": String,
 *     "gift_id": Number,
 *     "gift_name": String,
 *     "gift_num": Number,
 *     "gift_price": Number,
 *     "goaway_time": Number,
 *     "goods_id": Number,
 *     "id": Number,
 *     "is_broadcast": Number,
 *     "join_type": Number,
 *     "lot_status": Number,
 *     "max_time": Number,
 *     "require_text": String,
 *     "require_type": Number,
 *     "require_value": Number,
 *     "room_id": Number,
 *     "send_gift_ensure": Number,
 *     "show_panel": Number,
 *     "start_dont_popup": Number,
 *     "status": Number,
 *     "time": Number,
 *     "url": String,
 *     "web_url": String
 *   }
 * }}
 * @param room
 * @returns {Promise<void>}
 */
const processAnchorStart = async (info, room) => {
    try {
        await cacheAwardMessage(room, JSON.stringify({
            message: info.data.danmu,
            type: 'anchor',
            hash: info.data.id
        }), info.data.max_time)
        const anchorInfo = {
            room: room,
            hash: info.data.id,
            infos: {
                amount: info.data.gift_num,
                name: info.data.award_name,
                danmu: info.data.danmu,
                price: info.data.gift_price,
                require: {
                    text: info.data.require_text,
                    type: info.data.require_type,
                    value: info.data.require_value
                }
            },
            winners: [],
            time: {
                start: new Date(info.data.current_time),
                duration: info.data.max_time
            }
        }
        logger.anchor(`Room ${room} has started an anchor draw, award is ${info.data.award_name}.`)
        const res = await saveAnchorStart(anchorInfo)
        if (res.status === false) {
            logger.warn(`An error occurred when saving anchor start info to database, message:${res.message}`)
        }
    } catch (e) {
        logger.warn(`An error occurred when saving anchor start info to database, message:${e.message}`)
    }
}



module.exports = {
    processAnchorStart,
    processAnchorResult
}