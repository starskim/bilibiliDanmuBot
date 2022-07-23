const logger = require('../local/logger')
const {saveNewGuardInfo} = require("../database/guard");


/**
 * 保存新舰长的信息
 * @param info {{
 *   "cmd": String,
 *   "data": {
 *     "uid": Number,
 *     "username": String,
 *     "guard_level": Number,
 *     "num": Number,
 *     "price": Number,
 *     "gift_id": Number,
 *     "gift_name": String,
 *     "start_time": Number,
 *     "end_time": Number
 *   }
 * }} 舰长信息
 * @param room {number} 房间号
 * @returns {Promise<void>}
 */
const processNewGuardInfo = async (info,room)=>{
    try {
        const guardInfo = {
            room:room,
            uid:info.data.uid,
            level:info.data.guard_level,
            amount:info.data.num,
            price:info.data.price,
            time:{
                start:new Date(info.data.start_time * 1000),
                end: new Date(info.data.end_time * 1000)
            }
        }
        const res = await saveNewGuardInfo(guardInfo)
        if (res.status === false){
            logger.warn(`An error occurred during save guard info to database, message:${res.message}`)
        }
    }catch (e) {
        logger.warn(`An error occurred during save guard info, message:${e.message}`)
    }
}

module.exports = {
    processNewGuardInfo
}