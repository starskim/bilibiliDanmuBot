const logger = require('../local/logger')
const {registerNewClient, removeClientFromDB} = require("../database/manager");


/**
 *
 * @param info {{
 *     hash:String,
 *     rooms:Number,
 *     name:String,
 *     version:String,
 *     ip:String
 * }}
 * @returns {Promise<void>}
 */
const processNewClientRegister = async (info) => {
    try {
        const clientInfo = {
            hash:info.hash,
            name:info.name,
            version:info.version,
            ip:info.ip,
            amount:{
                room:info.rooms,
                mission:0
            }
        }
        const res = await registerNewClient(clientInfo)
        if (res.status === false) {
            logger.warn(`Register client ${info.hash} occurred an error, message:${res.message}`)
        } else {
            logger.debug(`Client ${info.name} register success.`)
        }
    } catch (e) {
        logger.warn(`Register client ${info.name} occurred an error, message:${e.message}`)
    }
}

/**
 * 处理客户端连接断开
 * @param clientId {string}
 * @returns {Promise<void>}
 */
const processClientDisconnect = async (clientId) => {
    try {
        const res = await removeClientFromDB(clientId)
        if (res.status === false) {
            logger.warn(`Unregister client ${clientId} has failed, message:${res.message}`)
        } else {
            logger.debug(`Client ${clientId} has disconnected`)
        }
    } catch (e) {
        logger.warn(`Unregister client ${clientId} has errored, message:${e.message}`)
    }
}


module.exports = {
    processNewClientRegister,
    processClientDisconnect
}