const Redis = require('ioredis')
const config = require('../../../local/config')
const logger = require('../../../local/logger')
const redis = new Redis(`${config.get('database.redis')}3`)

/**
 * 缓存消息到redis数据库,并返回此消息是否已经在数据库中存在
 *
 * @param hash {string} 任务类型
 * @param args {any} 消息类型
 * @param ttl {number} 消息存活时间
 * @returns {Promise<{message: string, status: boolean}>} true则存在,false则不存在
 */
const cacheNewMission = async (hash,args, ttl) => {
    const res = await redis.set(hash, JSON.stringify(args), 'EX' ,ttl)
    if (res !== 'OK'){
        logger.warn(`An error occurred when caching new mission,info:${JSON.stringify(args)}`)
    }
}

/**
 * 获取缓存队列中的所有任务列表
 * @returns {Promise<{total: number, missions: *[string]}>}
 */
const getAllCachedMissions = async ()=>{
    let cursor = 0
    const missions = []
    do {
        const res = await redis.scan(cursor)
        cursor = Number.parseInt(res[0])
        for (let i = 0; i < res[1].length; i++) {
            missions.push(res[1][i])
        }
    }while (cursor !== 0)
    return {total:missions.length,missions:missions}
}


/**
 * 获取任务对应信息
 * @param missionId {string}
 * @returns {Promise<string|null>}
 */
const getMissionDetail = async (missionId)=>{
    return redis.get(missionId);
}

/**
 *
 * @param missionId {string}
 * @returns {Promise<void>}
 */
const deleteMission = async (missionId)=>{
    await redis.del(missionId)
}

redis.on('error', e => {
    logger.error(`There is an error occurred when connecting redis, message:${e.message}`)
    process.exit(-1001)
})


module.exports = {
    deleteMission,
    cacheNewMission,
    getMissionDetail,
    getAllCachedMissions
}