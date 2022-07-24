const Redis = require('ioredis')
const config = require('../local/config')
const logger = require('../local/logger')
const redis = new Redis(`${config.get('database.redis')}2`)

/**
 * 缓存消息到redis数据库,并返回此消息是否已经在数据库中存在
 *
 * @param room {Number} 房间号
 * @param message {String} 弹幕参与口令内容
 * @param ttl {number} 缓存存活时间
 * @returns {Promise<boolean>} true则存在,false则不存在
 */
const cacheAwardMessage = async (room, message, ttl) => {
    const res = await redis.set(`${room}`, message, 'EX', ttl)
    return res === null;
}


/**
 * 获取房间号对应的领取口令(如果有)
 * @param room {Number}
 * @returns {Promise<String|null>}
 */
const getAwardMessage = async (room) => {
    return redis.get(`${room}`);
}

redis.on('error', e => {
    logger.error(`There is an error occurred when connecting redis\n${e.message}`)
    process.exit(-1002)
})


module.exports = {
    cacheAwardMessage,
    getAwardMessage
}