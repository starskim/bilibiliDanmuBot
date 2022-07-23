const Redis = require('ioredis')
const md5 = require('md5')
const config = require('../local/config')
const logger = require('../local/logger')
const redis = new Redis(`${config.get('database.redis')}0`)

/**
 * 缓存消息到redis数据库,并返回此消息是否已经在数据库中存在
 *
 * @param message {string} 任意消息
 * @param ttl {number} 缓存存活时间
 * @returns {Promise<boolean>} true则存在,false则不存在
 */
const cacheLiveMessage = async (message,ttl)=>{
    const hash = md5(message)
    const res = await redis.set(hash,'exits','NX','EX',ttl)
    return res === null;
}

redis.on('error',e=>{
    logger.error(`There is an error occurred when connecting redis\n${e.message}`)
    process.exit(-1000)
})


module.exports = {
    cacheLiveMessage
}