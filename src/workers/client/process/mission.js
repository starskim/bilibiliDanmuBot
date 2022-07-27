const logger = require('../local/logger')
const {v4: uuidv4} = require('uuid');
const {deleteMission, getAllCachedMissions, getMissionDetail, cacheNewMission} = require("../cache/mission");
const {getClientForMission} = require("../database/manager");

/**
 *
 * @param data {any}
 * @param client {string}
 * @returns {Promise<void>}
 */
const processClientAcceptMission = async (data, client) => {
    await deleteMission(data.hash)
    logger.info(`Mission ${data.hash} has been accepted by client ${client}`)
}


/**
 * 创建一个任务并提交到任务缓存中
 * 任务类型:从B站直播首页中拉取所有房间数据
 * @returns {Promise<void>}
 */
const processRoomAddFromIndex = async () => {
    const hash = uuidv4(undefined, undefined, undefined)
    await cacheNewMission(hash, {
        hash: hash,
        message: `Get room list from live home page`,
        type: 'GET_ROOM_FROM_INDEX'
    }, 3600)
}


/**
 * 发布所有任务到客户端
 * 按照数据库中客户端列表执行任务数量从少到多排序
 * @param port {MessagePort}
 * @returns {Promise<void>}
 */
const processMissionDeploy = async (port) => {
    const missionList = await getAllCachedMissions()
    for (let i = 0; i < missionList.total; i++) {
        const getClient = await getClientForMission()
        if (getClient.status === false) {
            logger.warn(`An error occurred when deploying mission, message:${getClient.message}`)
            break
        }
        let missionInfo = undefined
        try {
            missionInfo = JSON.parse(await getMissionDetail(missionList.list[i]))
        } catch (e) {
            logger.warn(`An error occurred when parsing json, message:${e.message}`)
        }
        if (missionInfo !== null && missionInfo !== undefined) {
            logger.debug(`Sending mission ${missionList.list[i]} to client ${getClient.client}`)
            port.postMessage({
                send: true,
                client: getClient.client,
                type: 'GET_ROOM_FROM_INDEX',
                data: missionInfo
            })
        }
        //等待一秒以允许客户端重新同步自身任务数量
        await new Promise(resolve => {
            setTimeout(resolve, 1000)
        })
    }
}


module.exports = {
    processClientAcceptMission,
    processMissionDeploy,
    processRoomAddFromIndex
}