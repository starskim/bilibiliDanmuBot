const logger = require('../../local/logger')
const {
    saveNewSuperChatInfos,
    updateSuperChatJpnMessage,
    markSuperChatAsDeleted
} = require("../../database/live/superChat");


/**
 *
 * @param infos {{
 *   "cmd": String,
 *   "data": {
 *     "background_bottom_color": String,
 *     "background_color": String,
 *     "background_color_end": String,
 *     "background_color_start": String,
 *     "background_icon": String,
 *     "background_image": String,
 *     "background_price_color": String,
 *     "color_point": Number,
 *     "dmscore": Number,
 *     "end_time": Number,
 *     "gift": {
 *       "gift_id": Number,
 *       "gift_name": String,
 *       "num": Number
 *     },
 *     "id": Number,
 *     "is_ranked": Number,
 *     "is_send_audit": Number,
 *     "medal_info": {
 *       "anchor_roomid": Number,
 *       "anchor_uname": String,
 *       "guard_level": Number,
 *       "icon_id": Number,
 *       "is_lighted": Number,
 *       "medal_color": String,
 *       "medal_color_border": Number,
 *       "medal_color_end": Number,
 *       "medal_color_start": Number,
 *       "medal_level": Number,
 *       "medal_name": String,
 *       "special": String,
 *       "target_id": Number
 *     },
 *     "message": String,
 *     "message_font_color": String,
 *     "message_trans": String,
 *     "price": Number,
 *     "rate": Number,
 *     "start_time": 1658692267,
 *     "time": Number,
 *     "token": String,
 *     "trans_mark": Number,
 *     "ts": Number,
 *     "uid": Number,
 *     "user_info": {
 *       "face": String,
 *       "face_frame": String,
 *       "guard_level": Number,
 *       "is_main_vip": Number,
 *       "is_svip": Number,
 *       "is_vip": Number,
 *       "level_color": String,
 *       "manager": Number,
 *       "name_color": String,
 *       "title": String,
 *       "uname": String,
 *       "user_level": Number
 *     }
 *   },
 *   "roomid": Number
 * }}
 * @param room {Number}
 * @returns {Promise<void>}
 */
const processSuperChatSends = async (infos, room) => {
    try {
        const scInfos = {
            room: room,
            hash: infos.data.id,
            info: {
                message: infos.data.message,
                deleted: false,
                price: infos.data.price,
                time: infos.data.time
            },
            sender: {
                uid: infos.data.uid,
                name: infos.data.user_info.uname,
                face: infos.data.user_info.face,
                level: infos.data.user_info.user_level
            }
        }
        logger.sc(`User ${infos.data.user_info.uname} send message:${infos.data.message} at price $${infos.data.price}`)
        const res = await saveNewSuperChatInfos(scInfos)
        if (res.status === false) {
            logger.warn(`An error occurred when saving sc info to database, message:${res.message}`)
        }
    } catch (e) {
        logger.warn(`An error occurred when saving sc info to database, message:${e.message}`)
    }
}

/**
 *
 * @param infos {{
 *   "cmd": String,
 *   "data": {
 *     "background_bottom_color": String,
 *     "background_color": String,
 *     "background_color_end": String,
 *     "background_color_start": String,
 *     "background_icon": String,
 *     "background_image": String,
 *     "background_price_color": String,
 *     "color_point": Number,
 *     "dmscore": Number,
 *     "end_time": Number,
 *     "gift": {
 *       "gift_id": Number,
 *       "gift_name": String,
 *       "num": Number
 *     },
 *     "id": String,
 *     "is_ranked": Number,
 *     "is_send_audit": Number,
 *     "medal_info": {
 *       "anchor_roomid": Number,
 *       "anchor_uname": String,
 *       "guard_level": Number,
 *       "icon_id": Number,
 *       "is_lighted": Number,
 *       "medal_color": String,
 *       "medal_color_border": Number,
 *       "medal_color_end": Number,
 *       "medal_color_start": Number,
 *       "medal_level": Number,
 *       "medal_name": String,
 *       "special": String,
 *       "target_id": Number
 *     },
 *     "message": String,
 *     "message_font_color": String,
 *     "message_jpn": String,
 *     "price": Number,
 *     "rate": Number,
 *     "start_time": 1658692267,
 *     "time": Number,
 *     "token": String,
 *     "trans_mark": Number,
 *     "ts": Number,
 *     "uid": Number,
 *     "user_info": {
 *       "face": String,
 *       "face_frame": String,
 *       "guard_level": Number,
 *       "is_main_vip": Number,
 *       "is_svip": Number,
 *       "is_vip": Number,
 *       "level_color": String,
 *       "manager": Number,
 *       "name_color": String,
 *       "title": String,
 *       "uname": String,
 *       "user_level": Number
 *     }
 *   },
 *   "roomid": Number
 * }}
 * @returns {Promise<void>}
 */
const processSuperChatJpn = async (infos) => {
    try {
        const JpnInfo = {
            hash: Number.parseInt(infos.data.id),
            message: infos.data.message_jpn
        }
        const res = await updateSuperChatJpnMessage(JpnInfo)
        if (res.status === false) {
            logger.warn(`An error occurred when update sc info to database, message:${res.message}`)
        }
    } catch (e) {
        logger.warn(`An error occurred when update sc info, message:${e.message}`)
    }
}


/**
 * 处理SC删除事件
 * @param infos {{
 *   "cmd": String,
 *   "data": {
 *     "ids": [
 *       Number
 *     ]
 *   },
 *   "roomid": Number
 * }}
 * @returns {Promise<void>}
 */
const processSuperChatDeletion = async (infos) => {
    try {
        for (let i = 0; i < infos.data.ids.length; i++) {
            const res = await markSuperChatAsDeleted({hash: infos.data.ids[i]})
            if (res.status === false) {
                logger.warn(`An error occurred when marking sc ${infos.data.ids[i]} as delete, message:${res.message}`)
            }
        }
    } catch (e) {
        logger.warn(`An error occurred when processing sc deletion, message:${e.message}`)
    }
}


module.exports = {
    processSuperChatSends,
    processSuperChatJpn,
    processSuperChatDeletion
}