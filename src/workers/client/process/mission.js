const logger = require('../local/logger')
const {deleteMission} = require("../cache/mission");

/**
 *
 * @param data {any}
 * @param client {string}
 * @returns {Promise<void>}
 */
const processClientAcceptMission = async (data,client)=>{
    await deleteMission(data.mission)
    logger.info(`Mission ${data.mission} has been accepted by client ${client}`)
}



module.exports = {
    processClientAcceptMission
}