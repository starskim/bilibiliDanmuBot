const logger = require("../local/logger");
const config = require("../local/config");
const {connectToDatabase} = require("../database/live/init");
const {processNewClientRegister, processClientDisconnect} = require("../process/client/connection");


let isConnected = false
connectToDatabase(config.get('database.mongoDB')).then((res) => {
    if (res.status === true) {
        isConnected = true
    } else {
        logger.warn(`An error occurred connecting to database:${res.message}`)
        process.exit(100044)
    }
})

/**
 *
 * @param info {{
 *     type:String,
 *     client:String,
 *     data:any
 * }}
 * @returns {Promise<{event: string ,args:any?}>}
 */

const processClientMessage = async (info) => {
    switch (info.type) {
        case 'CLIENT_REGISTER':
            await processNewClientRegister(info.data)
            return {event: 'REGISTER_SUCCESS', args: info.client}

        case'CLIENT_DISCONNECT':
            await processClientDisconnect(info.client)

    }
}


module.exports = async (workerInfo) => {
    while (isConnected === false) {
        await new Promise(resolve => {
            setTimeout(resolve, 100)
        })
    }
    return await processClientMessage(workerInfo)
}