require('./src/socket/server')//引入服务器支持
const logger = require('./src/local/logger')
const config = require('./src/local/config')
const {startAllScheduleJob} = require("./src/service/timer");
const {connectToDatabase} = require("./src/database/init");
const {removeAllClientConnections} = require("./src/database/client");
const main = async ()=>{
    const res = await connectToDatabase(config.get('database.mongoDB'))
    if (res.status === false){
        logger.error(`Fatal error occurred when connecting to database, message:${res.message}`)
        process.exit(10002)
    }
    const clientResult = await removeAllClientConnections()
    if (clientResult.status === false){
        logger.error(clientResult.message)
        process.exit(-12203)
    }
    logger.info(`All connection has been removed from database.`)
    await startAllScheduleJob()
    logger.info(`Service started`)
}


main().then()