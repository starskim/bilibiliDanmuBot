const logger = require('../../local/logger')
const {saveUserJoinInfo} = require("../../database/live/join");


/**
 *
 * @param info {{
  "cmd": String,
  "data": {
    "contribution": {
      "grade": Number
    },
    "dmscore": Number,
    "fans_medal": {
      "anchor_roomid": Number,
      "guard_level": Number,
      "icon_id": Number,
      "is_lighted": Number,
      "medal_color": Number,
      "medal_color_border": Number,
      "medal_color_end": Number,
      "medal_color_start": Number,
      "medal_level": Number,
      "medal_name": String,
      "score": Number,
      "special": String,
      "target_id": Number
    },
    "identities": [
      Number
    ],
    "is_spread": Number,
    "msg_type": Number,
    "privilege_type": Number,
    "roomid": Number,
    "score": Number,
    "spread_desc": String,
    "spread_info": String,
    "tail_icon": Number,
    "timestamp": Number,
    "trigger_time": Number,
    "uid": Number,
    "uname": String,
    "uname_color": String
  }
}}
 * @param room {number}
 * @returns {Promise<void>}
 */
const processInteractMessage = async (info, room) => {
    if (info.data.msg_type === 1) { // 1=进场 2=关注
        const userJoinInfo = {
            uid: info.data.uid,
            medal: {
                level: info.data.fans_medal.medal_level,
                name: info.data.fans_medal.medal_name
            }
        }
        logger.join(`User ${info.data.uname} joined room ${room}.`)
        await processUserJoin(userJoinInfo, room)
        return
    }

    if (info.data.msg_type === 2) { //关注消息
        //此方式获取关注用户不及时且不准确,废弃
    }
}


/**
 * 处理用户加入信息,并保存到数据库
 * @param info {{
 *     uid:number,
 *     medal:{
 *         level:number,
 *         name:string
 *     }
 * }} 对应信息
 * @param room {number} 房间号
 * @returns {Promise<void>}
 */
const processUserJoin = async (info, room) => {
    try {
        const joinInfo = {
            room: room,
            uid: info.uid,
            medal: {
                level: info.medal.level,
                name: info.medal.name,
            }
        }
        const res = await saveUserJoinInfo(joinInfo)
        if (res.status === false) {
            logger.warn(`An error occurred while saving user join message to database, message:${res.message}`)
        }
    } catch (e) {
        logger.warn(`An error occurred while saving user join message, message:${e.message}`)
    }
}

module.exports = {
    processInteractMessage
}