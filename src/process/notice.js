const logger = require('../local/logger')
const {saveNoticeInfo} = require("../database/notice");


/**
 *
 * @param info {{
 *   "cmd": String,
 *   "id": Number,
 *   "name": String,
 *   "full": {
 *     "head_icon": String,
 *     "tail_icon": String,
 *     "head_icon_fa": String,
 *     "tail_icon_fa": String,
 *     "head_icon_fan": Number,
 *     "tail_icon_fan": Number,
 *     "background": String,
 *     "color": String,
 *     "highlight": String,
 *     "time": Number
 *   },
 *   "half": {
 *     "head_icon": String,
 *     "tail_icon": String,
 *     "background": String,
 *     "color": String,
 *     "highlight": String,
 *     "time": Number
 *   },
 *   "side": {
 *     "head_icon": String,
 *     "background": String,
 *     "color": String,
 *     "highlight": String,
 *     "border": String
 *   },
 *   "roomid": Number,
 *   "real_roomid": Number,
 *   "msg_common": String,
 *   "msg_self": String,
 *   "link_url":String,
 *   "msg_type": Number,
 *   "shield_uid": Number,
 *   "business_id": String,
 *   "scatter": {
 *     "min": 0,
 *     "max": 0
 *   },
 *   "marquee_id": String,
 *   "notice_type": Number
 * }}
 * @returns {Promise<void>}
 */
const processNoticeMessage = async (info)=>{
    try {
        const noticeInfo = {
            room:info.roomid,
            type:info.id,
            name:info.name,
            message:info.msg_common,
            businessHash:Number.parseInt(info.business_id),
            selfMessage:info.msg_self
        }
        const res = await saveNoticeInfo(noticeInfo)
        if (res.status === false ){
            logger.warn(`An error occurred when saving notice info to database, message:${res.message}`)
        }
    }catch (e) {
        logger.warn(`An error occurred when saving notice info, message:${e.message}`)
    }
}


module.exports = {
    processNoticeMessage
}