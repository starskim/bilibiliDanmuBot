const logger = require('../../local/logger')
const {saveRoomMuteInfo} = require("../../database/live/silent");


/**
 *
 * @param info {{
  data: { type: string, level: number, second: number },
  cmd: string
}} 对应信息
 * @param room {number} 房间号
 * @returns {Promise<void>}
 */
const processRoomSilentOperation = async (info, room) => {
    try {
        let silentInfo
        if (info.cmd === 'ROOM_SILENT_OFF') {
            logger.mute(`Room ${room} stopped mute.`)
            silentInfo = {
                room: room,
                type: info.data.type,
                level: info.data.level,
                until: new Date(info.data.second * 1000),
                method: `DISABLE`
            }
        } else {
            logger.mute(`Room ${room} starts mute users whose ${info.data.type} lower than ${info.data.level}.`)
            silentInfo = {
                room: room,
                type: info.data.type,
                level: info.data.level,
                until: new Date(info.data.second * 1000),
                method: `ENABLE`
            }
        }
        const res = await saveRoomMuteInfo(silentInfo)
        if (res.status === false) {
            logger.warn(`An error occurred when saving room mute info to database, message:${res.message}`)
        }
    } catch (e) {
        logger.warn(`An error occurred when saving room mute info, message:${e.message}`)
    }
}


module.exports = {
    processRoomSilentOperation
}