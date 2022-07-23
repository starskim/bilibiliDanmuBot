const logger = require('../local/logger')
const {saveBlockMessage} = require("../database/block");


/**
 *
 * @param info {Object}
 * @param room {number}
 * @returns {Promise<void>}
 */
const processBlockMessage = async (info,room)=>{
    try {
        const blockInfo = {
            uid:info.data.uid,
            room:room,
            operator:info.data.operator,
            name:info.data.uname,
            dmscore:info.data.dmscore
        }
        logger.block(`[${info.data.uname}] 被房间 ${room} 封禁, 操作人:${info.data.operator}`)
        const res = await saveBlockMessage(blockInfo)
        if (res.status === false){
            logger.warn(`An error occurred when saving user block info to database, message:${res.message}`)
        }
    }catch (e) {
        logger.warn(`An error occurred when saving user block info, message:${e.message}`)
    }
}


module.exports = {
    processBlockMessage
}