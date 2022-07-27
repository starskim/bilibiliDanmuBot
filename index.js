require('./src/socket/server')//引入服务器支持
const logger = require('./src/local/logger')
const {startAllScheduleJob} = require("./src/service/timer");

const main = async ()=>{
    logger.info(`Server started.`)
    await startAllScheduleJob()
}


main().then()