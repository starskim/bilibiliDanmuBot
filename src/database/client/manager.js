const db = require('./db')

/**
 * 保存客户端注册信息
 * @param info {{
 *     hash:String,
 *     rooms:Number,
 *     name:String,
 *     version:String,
 *     ip:String
 * }}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const registerNewClient = async (info) => {
    try {
        await new db.client(info).save()
        return {status: true, message: `OK`}
    } catch (e) {
        return {status: false, message: e.message}
    }
}


/**
 * 更新客户端所保持连接的房间数量
 * @param info {{
 *     id:String,
 *     amount:Number
 * }}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const updateClientRoomAmount = async (info) => {
    try {
        await db.client.updateOne({hash: info.id}, {
            $set: {
                rooms: info.amount
            }
        }).exec()
        return {status: true, message: 'OK'}
    } catch (e) {
        return {status: false, message: e.message}
    }
}

/**
 * 从数据库中删除客户端连接信息
 * @param id {string} 客户端唯一id
 * @returns {Promise<{message: string, status: boolean}>}
 */
const removeClientFromDB = async (id) => {
    try {
        const res = await db.client.deleteOne({hash: id}).exec()
        if (res.deletedCount === false) {
            return {status: false, message: `Database didn't accept request`}
        }
        return {status: true, message: 'OK'}
    } catch (e) {
        return {status: false, message: e.message}
    }
}

module.exports = {
    registerNewClient,
    removeClientFromDB,
    updateClientRoomAmount
}