const {saveDanmuInfo} = require("../database/danmu");
const logger = require('../local/logger')



/**
 *
 * @param danmu {Object} 弹幕实体
 * @param room {number} 房间号
 * @returns {Promise<void>}
 */
const processDanmuMessage = async (danmu,room)=>{
    try {
        const infos = {
            uid:danmu.info[2][0],
            room:room,
            guard:danmu.info[7],
            message:danmu.info[1],
            medalInfo:{
                level:danmu.info[3][0],
                name:danmu.info[3][1],
                owner:{
                    uid:danmu.info[3][12],
                    name:danmu.info[3][2],
                    room:danmu.info[3][3]
                }
            }
        }
        logger.danmu(`[${danmu.info[2][1]}]:${danmu.info[1]}`)
        const res = await saveDanmuInfo(infos)
        if (res.status === false){
            logger.warn(`An error occurred when saving danmu info to database, message:${res.message}`)
        }
    }catch (e) {
        logger.warn(`An error occurred when saving danmu info, message:${e.message}`)
    }
}


module.exports = {
    processDanmuMessage
}