const db = require('./db')


const removeAllClientConnections = async () => {
    try {
        const res = await db.client.deleteMany({}).exec()
        if (res.acknowledged) {
            return {status: true, message: 'OK'}
        } else {
            return {status: false, message: `Database refused to remove all client connections.`}
        }
    } catch (e) {
        return {status: false, message: `An error occurred when removing all client connections, message:${e.message}`}
    }
}


module.exports = {
    removeAllClientConnections
}